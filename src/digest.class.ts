import { Options, Method } from './digest.interface';
import { getAuthDetails, createDigestResponse, createHa1, createHa2, getAlgorithm } from './digest.helpers';
import type { AxiosInstance, AxiosStatic, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { defer, firstValueFrom, mergeMap, Observable, retryWhen, throwError, timer } from 'rxjs';
import { URL } from 'url';

const EXP_BACKOFF_CODES = [429, 503];

export class AxiosDigest {
    private readonly axios: AxiosInstance | AxiosStatic;
    private readonly username: string;
    private readonly password: string;
    private readonly options: Options;
    private count: number;
    private hasRetried401: boolean;

    private readonly defaultOptions: Options = {
        retryOptions: {
            attempts: 10,
            excludedStatusCodes: [],
            exponentialBackupMultiplier: 1000,
        },
        retry: true,
    };

    constructor(
        username: string,
        password: string,
        customAxios: AxiosInstance | AxiosStatic,
        options?: Partial<Options>,
    ) {
        this.axios = customAxios;
        this.username = username;
        this.password = password;
        this.count = 0;
        this.options = options
            ? {
                  ...this.defaultOptions,
                  ...options,
                  retryOptions: { ...this.defaultOptions.retryOptions, ...options.retryOptions },
              }
            : this.defaultOptions;
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.sendRequest<T>(Method.GET, url, config);
    }

    public async post<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = data ? { data, ...config } : config;
        return await this.sendRequest<T>(Method.POST, url, config);
    }

    public async patch<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = data ? { data, ...config } : config;
        return await this.sendRequest<T>(Method.PATCH, url, config);
    }

    public async put<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = data ? { data, ...config } : config;
        return await this.sendRequest<T>(Method.PUT, url, config);
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.sendRequest<T>(Method.DELETE, url, config);
    }

    public async head<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.sendRequest<T>(Method.HEAD, url, config);
    }

    public async sendRequest<T>(method: Method, url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        const conf: AxiosRequestConfig = { method, url, ...config };

        // const observable = defer(() => this.axios.request<T>(conf)).pipe(this.retryStrategy({ method, url }));
        const observable = defer(() => this.axios.request<T>(conf)).pipe(this.retryStrategy({ method, url }));

        // not sure we need this, but want to make sure `hasRetried401` gets reset
        try {
            const result = await firstValueFrom(observable);
            return result;
        } catch (err) {
            throw err;
        } finally {
            this.hasRetried401 = false;
        }
    }

    private getAuthHeadersConfig(res: AxiosResponse): AxiosRequestConfig {
        const authDetails = getAuthDetails(res.headers['www-authenticate']);
        ++this.count;

        const nonceCount = ('00000000' + this.count).slice(-8);
        const cnonce = 'B1Spiule'; // seems to work with any hardcoded alphanumeric string with 8 chars
        const { algo, useSess } = getAlgorithm(authDetails['algorithm'] ?? authDetails['ALGORITHM'] ?? 'md5');
        const path = new URL(res.config.url).pathname;

        const ha1 = createHa1(
            this.username,
            this.password,
            algo,
            useSess,
            authDetails.realm,
            authDetails.nonce,
            cnonce,
        );
        const ha2 = createHa2(
            algo,
            authDetails.qop,
            res.config.method.toUpperCase() ?? 'GET',
            path,
            res.config.data ?? {},
        );

        const response = createDigestResponse(algo, ha1, ha2, authDetails.nonce, nonceCount, cnonce, authDetails.qop);

        const authorization =
            `Digest username="${this.username}",realm="${authDetails.realm}",` +
            `nonce="${authDetails.nonce}",uri="${path}",algorithm="${algo.toUpperCase()}",qop=${authDetails.qop},` +
            `nc=${nonceCount},cnonce="${cnonce}",response="${response}"`;

        res.config = { ...res.config, headers: { ...res.config.headers, authorization } };
        return res.config;
    }

    private retryStrategy({ method, url }): (_: Observable<any>) => Observable<any> {
        return retryWhen((errors) =>
            errors.pipe(
                mergeMap((error: AxiosError, i: number) => {
                    const retryAttempt = i + 1;
                    const status: number = error?.response?.status;
                    console.log(`attempt number ${retryAttempt} - status: ${status}`);
                    const authenticateHeader: string = error?.response?.headers['www-authenticate'];

                    // Only retry 401 once to get digest auth header,
                    // 401 after the first attempt likely means incorrect username/passwrd
                    if (i === 0 && !this.hasRetried401 && authenticateHeader && authenticateHeader.includes('nonce')) {
                        const newConfig = this.getAuthHeadersConfig(error.response);
                        this.hasRetried401 = true;
                        return this.sendRequest(method, url, newConfig);
                    } else {
                        if (this.options.retryOptions.excludedStatusCodes.includes(status)) {
                            return throwError(() => error);
                        }

                        if (this.options.retry && retryAttempt < this.options.retryOptions.attempts) {
                            // check if we should use exponential-backoff
                            if (EXP_BACKOFF_CODES.includes(status)) {
                                return timer(retryAttempt * this.options.retryOptions.exponentialBackupMultiplier);
                            }
                            return timer(0);
                        }
                    }
                    // just throw the http error in the end
                    return throwError(() => error);
                }),
            ),
        );
    }
}
