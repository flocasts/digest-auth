import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { DigestBase } from '../base/base';
import { getUniqueCnonce, getUniqueRequestHash } from '../base/base.helpers';
import { DigestRequest, HTTPClient, Method } from '../base/base.interface';

export class AxiosDigest extends DigestBase {
    constructor(username: string, password: string, httpClientInstance: HTTPClient['axios']) {
        super(username, password, httpClientInstance);
    }

    /**
     * Send a GET request using axios, with handling for possible digest authentication
     * @param path path to endpoint on server
     * @param config optional AxiosRequestConfig object
     */
    public async get<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.GET, url: path };
        return await this.sendRequest(config);
    }

    /**
     * Send a POST request using axios, with handling for possible digest authentication.
     * @param path path to endpoint on server
     * @param data optional data to send with request
     * @param config optional AxiosRequestConfig object
     */
    public async post<D, T>(path: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.POST, url: path, ...(data && data) };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a PATCH request using axios, with handling for possible digest authentication.
     * @param path path to endpoint on server
     * @param data optional data to send with request
     * @param config optional AxiosRequestConfig object
     */
    public async patch<D, T>(path: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.PATCH, url: path, ...(data && data) };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a PUT request using axios, with handling for possible digest authentication.
     * @param path path to endpoint on server
     * @param data optional data to send with request
     * @param config optional AxiosRequestConfig object
     */
    public async put<D, T>(path: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.PUT, url: path, ...(data && data) };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a DELETE request using axios, with handling for possible digest authentication.
     * @param path path to endpoint on server
     * @param config optional AxiosRequestConfig object
     */
    public async delete<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.DELETE, url: path };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a HEAD request using axios, with handling for possible digest authentication.
     * @param path path to endpoint on server
     * @param config optional AxiosRequestConfig object
     */
    public async head<T>(path: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        config = { ...config, method: Method.HEAD, url: path };
        return await this.sendRequest<T>(config);
    }

    /**
     * Send a request using axios, with handling for possible digest authentication.
     * @param path path to endpoint on server
     * @param config AxiosRequestConfig object
     */
    //
    public async request<D, T>(path: string, config: AxiosRequestConfig, data?: D): Promise<AxiosResponse<T>> {
        config = { ...config, url: path, data };
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
            this.requests[requestHash] = {
                retryCount: 0,
                hasRetried401: false,
                cnonce: getUniqueCnonce(),
            } as DigestRequest;
        }

        try {
            return await this.httpClient.request<T>(config);
        } catch (e: unknown) {
            const err = e as AxiosError;
            if (!err.isAxiosError) throw e;

            const statusCode = err.response.status;
            const authHeader = err.response.headers['www-authenticate'];

            // Only retry 401 once to get digest auth header,
            // 401 after the first attempt likely means incorrect username/password

            if (!this.shouldRetry401(statusCode, requestHash, authHeader)) {
                delete this.requests[requestHash];
                throw err;
            }

            this.requests[requestHash] = {
                ...this.requests[requestHash],
                retryCount: 1,
                hasRetried401: true,
            };
            const newAuthHeader = this.getAuthHeader(
                config,
                err.response.headers['www-authenticate'],
                this.requests[requestHash].retryCount,
                requestHash,
            );
            const newConfig: AxiosRequestConfig = {
                ...config,
                headers: { ...config.headers, authorization: newAuthHeader },
            };
            return await this.sendRequest(newConfig, requestHash);
        }
    }
}
