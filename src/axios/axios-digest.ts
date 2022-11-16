import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { DigestBase } from '../base/base';
import { getUniqueCnonce, getUniqueRequestHash } from '../base/base.helpers';
import { HTTPClient, Method, Options } from '../base/base.interface';

export class AxiosDigest extends DigestBase {
    constructor(
        username: string,
        password: string,
        httpClientInstance: HTTPClient['axios'],
        options?: Partial<Options>,
    ) {
        super(username, password, httpClientInstance, options);
    }

    /**
     * Send a GET request using axios, with handling for possible digest authentication
     * @param url URL for request
     * @param config optional AxiosRequestConfig object
     */
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.GET, url };
        return await this.sendRequest(config);
    }

    /**
     * Send a POST request using axios, with handling for possible digest authentication.
     * @param url URL for request
     * @param data optional data to send with request
     * @param config optional AxiosRequestConfig object
     */
    public async post<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.POST, url, ...(data && data) };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a PATCH request using axios, with handling for possible digest authentication.
     * @param url URL for request
     * @param data optional data to send with request
     * @param config optional AxiosRequestConfig object
     */
    public async patch<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.PATCH, url, ...(data && data) };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a PUT request using axios, with handling for possible digest authentication.
     * @param url URL for request
     * @param data optional data to send with request
     * @param config optional AxiosRequestConfig object
     */
    public async put<D, T>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.PUT, url, ...(data && data) };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a DELETE request using axios, with handling for possible digest authentication.
     * @param url URL for request
     * @param config optional AxiosRequestConfig object
     */
    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.DELETE, url };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a HEAD request using axios, with handling for possible digest authentication.
     * @param url URL for request
     * @param config optional AxiosRequestConfig object
     */
    public async head<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.HEAD, url };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a request using axios, with handling for possible digest authentication.
     * @param config AxiosRequestConfig object
     */
    //
    public async request<D, T>(url: string, config: AxiosRequestConfig, data?: D): Promise<AxiosResponse<T>> {
        config = { ...config, url, data };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a request to specified URL using axios. Handles digest-authentication enabled endpoints,
     * as well as both immediate and exponentially backed-off retries for (configurable) HTTP error status codes.
     * @param config AxiosRequestConfig object
     * @param requestHash unique hash string to keep track of different requests
     */
    protected async sendRequest<T>(config?: AxiosRequestConfig, requestHash?: string): Promise<AxiosResponse<T>> {
        if (!requestHash) {
            requestHash = getUniqueRequestHash();
            this.requests[requestHash] = { retryCount: 0, digest: { hasRetried401: false, cnonce: getUniqueCnonce() } };
        }

        try {
            return await this.httpClient.request<T>(config);
        } catch (e: any) {
            const err = e as AxiosError;
            if (!err.isAxiosError) throw e;

            const statusCode = err.response.status;
            const authHeader = err.response.headers['www-authenticate'];

            // Only retry 401 once to get digest auth header,
            // 401 after the first attempt likely means incorrect username/passwrd
            if (
                statusCode === 401 &&
                this.requests[requestHash].retryCount === 0 &&
                !this.requests[requestHash].digest.hasRetried401 &&
                authHeader.includes('nonce')
            ) {
                this.requests[requestHash] = {
                    retryCount: 1,
                    digest: { ...this.requests[requestHash].digest, hasRetried401: true },
                };
                const newAuthHeader = this.getAuthHeader(
                    config.url,
                    config.method as Method,
                    err.response.headers['www-authenticate'],
                    this.requests[requestHash].retryCount,
                    config.data,
                    requestHash,
                );
                const newConfig: AxiosRequestConfig = {
                    ...config,
                    headers: { ...config.headers, authorization: newAuthHeader },
                };
                return await this.sendRequest(newConfig, requestHash);
            }

            // whether or not digest-auth happened, handle retries if applicable
            await this.handleRetry(config, err, statusCode, requestHash);
        }
    }
}
