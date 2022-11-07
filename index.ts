// eslint-disable-next-line no-unused-vars
import axios, { AxiosInstance, AxiosStatic, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as md5 from 'js-md5';
import { sha256 } from 'js-sha256';
import { sha512, sha512_256 as sha512256 } from 'js-sha512';
import { Observable, defer, map, firstValueFrom, retryWhen, mergeMap, throwError, timer } from 'rxjs';

export enum Method {
	GET = 'GET',
	POST = 'POST',
	PATCH = 'PATCH',
	PUT = 'PUT',
	DELETE = 'DELETE',
	HEAD = 'HEAD',
}

export enum AUTH_ALGO {
	MD5 = 'md5',
	SHA256 = 'sha256',
	SHA512 = 'sha512',
	SHA512_256 = 'sha512-256',
}

export interface Options {
	retry: boolean;
	retryAttempts: number;
	timeout: number;
	baseUrl: string;
}

export default class AxiosDigest {
	private readonly axios: AxiosInstance | AxiosStatic;
	private readonly username: string;
	private readonly passwd: string;
	private readonly options: Options;
	private hasRetried401: boolean;

	private readonly defaultOptions: Options = {
		retry: true,
		retryAttempts: 10,
		timeout: 10000,
		baseUrl: '',
	};

	constructor(
		username: string,
		password: string,
		customAxios?: AxiosInstance | AxiosStatic,
		options?: Partial<Options>,
	) {
		this.axios = customAxios ? customAxios : axios.create();
		this.username = username;
		this.passwd = password;
		this.options = options ? { ...this.defaultOptions, ...options } : this.defaultOptions;
	}

	public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return await this.sendRequest<T>(Method.GET, url, config);
	}

	public async post<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
		config = data ? { data, ...config } : config;
		return await this.sendRequest<T>(Method.POST, url, config);
	}

	public async patch<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
		config = data ? { data, ...config } : config;
		return await this.sendRequest<T>(Method.PATCH, url, config);
	}

	public async put<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
		config = data ? { data, ...config } : config;
		return await this.sendRequest<T>(Method.PUT, url, config);
	}

	public async delete(url: string, config?: AxiosRequestConfig): Promise<unknown> {
		return await this.sendRequest(Method.DELETE, url, config);
	}

	public async head(url: string, config?: AxiosRequestConfig): Promise<unknown> {
		return await this.sendRequest(Method.HEAD, url, config);
	}

	public async sendRequest<T>(method: Method, url: string, config?: AxiosRequestConfig): Promise<T> {
		const conf: AxiosRequestConfig = {
			method,
			url,
			...(this.options.baseUrl !== '' && { baseURL: this.options.baseUrl }),
			timeout: this.options.timeout,
			...config,
		};

		const observable = defer(() => this.axios.request<{ data: T }>(conf)).pipe(
			retryWhen(this.retryStrategy({ method, url, config: conf })),
			map((res: AxiosResponse<{ data: T }>) => {
				return res.data.data;
			}),
		);

		return await firstValueFrom(observable);
	}

	private getAuthHeadersConfig(
		authHeader: string,
		method: Method,
		url: string,
		config: AxiosRequestConfig,
	): AxiosRequestConfig {
		const paramsString: string[] = authHeader.split(/\s*,?\s*Digest\s*/).filter((val) => val !== '');
		const paramsArray: string[][] = paramsString.map((val) => val.split(/\s*,(?=(?:[^"]*"[^"]*")*)\s*/));
		const paramsKvArray: [string, string][][] = paramsArray.map((val) =>
			val.map((value) => {
				const res = value
					.split(/\s*=(?:(?=[^"]*"[^"]*")|(?!"))\s*/, 2)
					.map((v2) => v2.replace(/^"/, '').replace(/"$/, ''));
				return [res[0], res[1]];
			}),
		);
		const paramsMapArray: { [s: string]: string }[] = paramsKvArray.map((val) => {
			const t: { [s: string]: string } = {};
			val.forEach((w) => {
				t[w[0]] = w[1];
			});
			return t;
		});
		const calams = ['realm', 'nonce', 'qop'];
		const paramsCalamsOk = paramsMapArray
			.map((val) => {
				if (!('algorithm' in val)) {
					val.algorithm = AUTH_ALGO.MD5;
				}
				return val;
			})
			.filter((val) => Object.values(AUTH_ALGO).includes(val.algorithm as AUTH_ALGO))
			.filter((val) => calams.filter((value) => !(value in val)).length === 0)
			.filter((val) => val.qop.split(/\s*,\s*/).filter((val) => val === 'auth').length !== 0);

		if (paramsCalamsOk.length === 0) {
			throw new Error('Auth params error');
		}

		paramsCalamsOk.sort((a, b) => {
			const [aEval, bEval] = [a.algorithm, b.algorithm].map((val) => {
				switch (val as AUTH_ALGO) {
					case AUTH_ALGO.MD5:
						return 0;
					case AUTH_ALGO.SHA256:
						return 1;
					case AUTH_ALGO.SHA512_256:
						return 2;
					case AUTH_ALGO.SHA512:
					default:
						return 3;
				}
			});
			return bEval - aEval;
		});

		const params: { [s: string]: string } = paramsCalamsOk[0];
		const { username, passwd } = this;
		const { realm, nonce, opaque, algorithm } = params;
		const uri: string = url.split(/^https?:\/\/[^/]+/).filter((v) => v !== '')[0];
		const cnonce: string = Math.random().toString(36).substring(2, 10);
		const nc: string = '00000001';
		const qop: string = 'auth';

		const hashHex = ((): ((str: string) => string) => {
			if (algorithm === 'MD5') return md5;
			if (algorithm === 'SHA-256') return sha256;
			if (algorithm === 'SHA-512-256') return sha512256;
			return sha512;
		})();

		const hashHexArray = (data: string[]) => hashHex(data.join(':'));
		const a1 = [username, realm, passwd];
		const a1hash = hashHexArray(a1);
		const a2 = [method, uri];
		const a2hash = hashHexArray(a2);
		const a3 = [a1hash, nonce, nc, cnonce, qop, a2hash];
		const response = hashHexArray(a3);
		const dh: { [s: string]: string } = {
			realm,
			nonce,
			uri,
			username,
			cnonce,
			nc,
			qop,
			algorithm,
			response,
			opaque,
		};

		const auth = `Digest ${Object.keys(dh)
			.map((v) => `${v}="${dh[v]}"`)
			.join(', ')}`;

		if (config === undefined) {
			return { headers: { Authorization: auth } };
		}

		if (config.headers === undefined) {
			config.headers = {};
		}
		config.headers.Authorization = auth;
		return config;
	}

	private retryStrategy =
		({ method, url, config }) =>
		(attempts: Observable<any>) => {
			return attempts.pipe(
				mergeMap((error, i) => {
					const retryAttempt = i + 1;

					if (error.status !== 401) {
						// we could (should?) add other http status codes
						// that are excluded from retrying, i.e. 429: too many requests
						// we could also extend the options to take a number[] of http status codes we exclude

						if (this.options.retry && retryAttempt < this.options.retryAttempts) {
							// should the retry multiplier be configurable?
							return timer(retryAttempt * 1000);
						}
					} else if (i === 0 && !this.hasRetried401) {
						// only retry 401 once to get new authHeader,
						// 401 after the first time likely means incorrect username/passwrd
						const authHeader: string = error.response.headers['www-authenticate'];
						const newConfig = this.getAuthHeadersConfig(authHeader, method, url, config);
						this.hasRetried401 = true;
						return this.sendRequest(method, url, newConfig);
					}
					// just throw the http error in the end
					return throwError(() => error);
				}),
			);
		};
}
