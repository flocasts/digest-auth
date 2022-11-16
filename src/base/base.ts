import { DigestRequestMap, Method, SupportedHTTPClient } from './base.interface';
import {
    getAuthDetails,
    createDigestResponse,
    createHa1,
    createHa2,
    getAlgorithm,
    getUniqueCnonce,
} from './base.helpers';
import { URL } from 'url';

export abstract class DigestBase {
    protected readonly httpClient: SupportedHTTPClient;
    protected readonly username: string;
    protected readonly password: string;
    // This is used for keeping track of each requests attempts separately, and stores the cnonce.
    protected requests: DigestRequestMap;

    constructor(username: string, password: string, httpClientInstance: SupportedHTTPClient) {
        this.httpClient = httpClientInstance;
        this.username = username;
        this.password = password;
        this.requests = new Map();
    }

    public abstract get(url: string, config?: unknown): Promise<unknown>;
    public abstract post<D>(url: string, config?: unknown, data?: D): Promise<unknown>;
    public abstract put<D>(url: string, config?: unknown, data?: D): Promise<unknown>;
    public abstract put<D>(url: string, config?: unknown, data?: D): Promise<unknown>;
    public abstract delete(url: string, config?: unknown): Promise<unknown>;
    public abstract head(url: string, config?: unknown): Promise<unknown>;
    public abstract request<D>(url: string, config: Record<string, any>, data?: D): Promise<unknown>;
    protected abstract sendRequest(config?: Record<string, any>, requestHash?: string): Promise<unknown>;

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
    protected getAuthHeader(
        url: string,
        method: Method,
        digestHeader: string,
        attemptCount: number,
        data?: any,
        requestHash?: string,
    ): string {
        const authDetails = getAuthDetails(digestHeader);

        const nonceCount = ('00000000' + attemptCount).slice(-8);

        const cnonce: string = this.requests[requestHash].cnonce ?? getUniqueCnonce();

        const { algo, useSess } = getAlgorithm(authDetails['algorithm'] ?? authDetails['ALGORITHM'] ?? 'md5');
        const path = new URL(url).pathname;

        const ha1 = createHa1(
            this.username,
            this.password,
            algo,
            useSess,
            authDetails.realm,
            authDetails.nonce,
            cnonce,
        );
        const ha2 = createHa2(algo, authDetails.qop, (method as string) ?? 'GET', path, data ?? '');

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

    protected shouldRetry401(statusCode: number, requestHash: string, authHeader: string): boolean {
        return (
            statusCode === 401 &&
            this.requests[requestHash].retryCount === 0 &&
            !this.requests[requestHash].hasRetried401 &&
            authHeader.includes('nonce')
        );
    }
}
