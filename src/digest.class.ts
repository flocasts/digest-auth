import { Options, Method } from './digest.interface';
import {
    getAuthDetails,
    createDigestResponse,
    createHa1,
    createHa2,
    getAlgorithm,
    sleep,
    getUniqueRequestHash,
} from './digest.helpers';
import type { AxiosInstance, AxiosStatic, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { URL } from 'url';

export class AxiosDigest {
    private readonly axios: AxiosInstance | AxiosStatic;
    private readonly username: string;
    private readonly password: string;
    private readonly options: Options;
    /**
     * This is used for keeping track of each requests attempts seperately,
     * incase we ever have multiple requests firing at the same time.
     * Not sure if that's really possible here, but figured safety-first
     */
    private retryAttempts: Map<string, { count: number; hasRetried401: boolean }>;

    private readonly defaultOptions: Options = {
        retryOptions: {
            attempts: 10,
            excludedStatusCodes: [401],
            exponentialBackoffMultiplier: 1000,
            exponentialBackoffEnabledStatusCodes: [429, 503],
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
        this.retryAttempts = new Map();
        // this is a bit ugly but better safe than sorry when it comes to shallow merges
        this.options = options
            ? {
                  ...this.defaultOptions,
                  ...options,
                  retryOptions: {
                      ...this.defaultOptions.retryOptions,
                      ...options.retryOptions,
                  },
              }
            : this.defaultOptions;
    }

    /**
     * Convenient wrapper around the `sendRequest` method for GET requests
     * @param url URL for request
     * @param config AxiosRequestConfig object
     */
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.sendRequest<T>(Method.GET, url, config);
    }

    /**
     * Convenient wrapper around the `sendRequest` method for POST requests
     * @param url URL for request
     * @param data data to send with request
     * @param config AxiosRequestConfig object
     */
    public async post<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = data ? { data, ...config } : config;
        return await this.sendRequest<T>(Method.POST, url, config);
    }

    /**
     * Convenient wrapper around the `sendRequest` method for PATCH requests
     * @param url URL for request
     * @param data data to send with request
     * @param config AxiosRequestConfig object
     */
    public async patch<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = data ? { data, ...config } : config;
        return await this.sendRequest<T>(Method.PATCH, url, config);
    }

    /**
     * Convenient wrapper around the `sendRequest` method for PUT requests
     * @param url URL for request
     * @param data data to send with request
     * @param config AxiosRequestConfig object
     */
    public async put<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = data ? { data, ...config } : config;
        return await this.sendRequest<T>(Method.PUT, url, config);
    }

    /**
     * Convenient wrapper around the `sendRequest` method for DELETE requests
     * @param url URL for request
     * @param config AxiosRequestConfig object
     */
    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.sendRequest<T>(Method.DELETE, url, config);
    }

    /**
     * Convenient wrapper around the `sendRequest` method for HEAD requests
     * @param url URL for request
     * @param config AxiosRequestConfig object
     */
    public async head<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.sendRequest<T>(Method.HEAD, url, config);
    }

    /**
     * Method to build http requests
     * @param method HTTP method for request
     * @param url URL for request
     * @param config AxiosRequestConfig object
     */
    // This method exists so that we can keep the sendRequest method private for safety,
    // hides the `requestHash` param of sendRequest as that is only for internal use
    public async request<T>(method: Method, url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.sendRequest<T>(method, url, config);
    }

    /**
     * Send a request to specified URL using axios. Handles digest-authentication-enabled endpoints,
     * as well as both immediate and exponentially backed-off retries for (configurable) HTTP error status codes.
     * @param method HTTP method of request
     * @param url URL for request
     * @param config AxiosRequestConfig object
     */
    private async sendRequest<T>(
        method: Method,
        url: string,
        config?: AxiosRequestConfig,
        requestHash?: string,
    ): Promise<AxiosResponse<T>> {
        if (!requestHash) {
            requestHash = getUniqueRequestHash();
            this.retryAttempts[requestHash] = { count: 0, hasRetried401: false };
        }
        const conf: AxiosRequestConfig = { method, url, ...config };

        try {
            return await this.axios.request<T>(conf);
        } catch (e: any) {
            const err = e as AxiosError;
            if (!err.isAxiosError) throw e;

            const statusCode = err.response.status;
            const authHeader = err.response.headers['www-authenticate'];

            // Only retry 401 once to get digest auth header,
            // 401 after the first attempt likely means incorrect username/passwrd
            if (
                statusCode === 401 &&
                this.retryAttempts[requestHash].count === 0 &&
                !this.retryAttempts[requestHash].hasRetried401 &&
                authHeader.includes('nonce')
            ) {
                this.retryAttempts[requestHash] = { count: 1, hasRetried401: true };
                const newConfig = this.getAuthHeadersConfig(err.response, this.retryAttempts[requestHash].count);
                return await this.sendRequest(method, url, newConfig, requestHash);
            }

            if (
                this.options.retry &&
                !this.options.retryOptions.excludedStatusCodes.includes(statusCode) &&
                this.retryAttempts[requestHash].count < this.options.retryOptions.attempts
            ) {
                // check if we should use exponential-backoff, and sleep if needed
                if (this.options.retryOptions.exponentialBackoffEnabledStatusCodes.includes(statusCode)) {
                    await sleep(
                        this.retryAttempts[requestHash].count * this.options.retryOptions.exponentialBackoffMultiplier,
                    );
                }
                this.retryAttempts[requestHash].count += 1;
                return await this.sendRequest(method, url, config, requestHash);
            }
            delete this.retryAttempts[requestHash];
            throw err;
        }
    }

    /**
     * Parse `www-authenticate` header on requests to endpoints that use digest-auth,
     * and create `authorization` header for following authentication request
     * @param res AxiosResponse object used to build new config based on previous config
     * @returns AxiosRequestConfig object to be used in subsequent requests
     */
    private getAuthHeadersConfig(res: AxiosResponse, attemptCount: number): AxiosRequestConfig {
        const authDetails = getAuthDetails(res.headers['www-authenticate']);

        const nonceCount = ('00000000' + attemptCount).slice(-8);
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
                `nc=${nonceCount},cnonce="${cnonce}",response="${response}"` +
                authDetails.opaque && `opaque="${authDetails.opaque}"`;

        res.config = { ...res.config, headers: { ...res.config.headers, authorization } };
        return res.config;
    }
}
