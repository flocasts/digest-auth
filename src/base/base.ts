import { SupportedHTTPClient } from './base.interface';
import {
    getAuthDetails,
    createDigestResponse,
    createHa1,
    createHa2,
    getAlgorithm,
    getUniqueCnonce,
} from './base.helpers';
import { URL } from 'url';
import { AxiosRequestConfig } from 'axios';

export abstract class DigestBase {
    protected readonly httpClient: SupportedHTTPClient;
    protected readonly username: string;
    protected readonly password: string;

    constructor(username: string, password: string, httpClientInstance: SupportedHTTPClient) {
        this.httpClient = httpClientInstance;
        this.username = username;
        this.password = password;
    }

    public abstract get(url: string, config?: unknown): Promise<unknown>;
    public abstract post<D>(url: string, config?: unknown, data?: D): Promise<unknown>;
    public abstract put<D>(url: string, config?: unknown, data?: D): Promise<unknown>;
    public abstract delete(url: string, config?: unknown): Promise<unknown>;
    public abstract head(url: string, config?: unknown): Promise<unknown>;
    public abstract request<D>(url: string, config: Record<string, any>, data?: D): Promise<unknown>;
    protected abstract sendRequest(config: AxiosRequestConfig, isRetry401?: boolean): Promise<unknown>;

    /**
     * Parse `www-authenticate` header on requests to endpoints that use digest authentication,
     * and create `authorization` header value for following authentication request
     * @param url URL for request
     * @param method HTTP method for request
     * @param digestHeader `www-authenticate` header returned from server using digest authentication.
     * @param attemptCount number of attempts this request has made
     * @param data any data to be sent with the request
     * @param requestHash unique hash string to keep track of different requests
     */
    protected getAuthHeader(config: AxiosRequestConfig<any>, digestHeader: string, attemptCount: number): string {
        const authDetails = getAuthDetails(digestHeader);

        const nonceCount = ('00000000' + attemptCount).slice(-8);

        const cnonce: string = getUniqueCnonce();

        const { algo, useSess } = getAlgorithm(authDetails['algorithm'] ?? authDetails['ALGORITHM'] ?? 'md5');
        let url: URL;
        if (config.baseURL && config.url && !config.url.includes('http')) {
            url = new URL(config.baseURL + config.url);
        } else if (!config.baseURL) {
            url = new URL(config.url);
        } else if (!config.url) {
            url = new URL(config.baseURL);
        }
        const path = url.pathname;

        const ha1 = createHa1(
            this.username,
            this.password,
            algo,
            useSess,
            authDetails.realm,
            authDetails.nonce,
            cnonce,
        );
        const ha2 = createHa2(algo, authDetails.qop, config.method ?? 'GET', path, config.data ?? '');

        const response = createDigestResponse(algo, ha1, ha2, authDetails.nonce, nonceCount, cnonce, authDetails.qop);

        let authorization =
            `Digest username="${this.username}",realm="${authDetails.realm}",` +
            `nonce="${authDetails.nonce}",uri="${path}",algorithm="${
                authDetails['algorithm'] ?? authDetails['ALGORITHM'] ?? 'md5'
            }",qop=${authDetails.qop},` +
            `nc=${nonceCount},cnonce="${cnonce}",response="${response}"`;

        if (authDetails.opaque) {
            authorization += `opaque="${authDetails.opaque}"`;
        }

        return authorization;
    }
}
