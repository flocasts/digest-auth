import { Options, Method, SupportedHTTPClient } from './base.interface';
import { getAuthDetails, createDigestResponse, createHa1, createHa2, getAlgorithm, sleep } from './base.helpers';
import { URL } from 'url';

export abstract class DigestBase {
    protected readonly httpClient: SupportedHTTPClient;
    protected readonly username: string;
    protected readonly password: string;
    protected readonly options: Options;
    /**
     * This is used for keeping track of each requests attempts separately,
     * in case we ever have multiple requests firing at the same time.
     * Not sure if it's 100% needed, but safety-first
     */
    protected retryAttempts: Map<string, { count: number; hasRetried401: boolean }>;

    private readonly defaultOptions: Options = {
        retry: false,
        retryOptions: {
            attempts: 10,
            excludedStatusCodes: [401],
            exponentialBackoffMultiplier: 1000,
            exponentialBackoffEnabledStatusCodes: [429, 503],
        },
        timeout: 60 * 1000, // 1 minute
    };

    constructor(
        username: string,
        password: string,
        httpClientInstance: SupportedHTTPClient,
        options?: Partial<Options>,
    ) {
        this.httpClient = httpClientInstance;
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
     * @optional any data being sent with the request
     */
    protected getAuthHeader(
        url: string,
        method: Method,
        digestHeader: string,
        attemptCount: number,
        data?: any,
    ): string {
        const authDetails = getAuthDetails(digestHeader);

        const nonceCount = ('00000000' + attemptCount).slice(-8);
        const cnonce = 'B1Spiule'; // seems to work with any hardcoded alphanumeric string of 8 chars ?
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

    protected async handleRetry(config: Record<string, any>, err: unknown, statusCode: number, requestHash: string) {
        if (
            this.options.retry &&
            !this.options.retryOptions.excludedStatusCodes.includes(statusCode) &&
            // attempts - 1 because zero indexing
            this.retryAttempts[requestHash].count < this.options.retryOptions.attempts - 1
        ) {
            // check if we should use exponential-backoff, and sleep if needed
            if (this.options.retryOptions.exponentialBackoffEnabledStatusCodes.includes(statusCode)) {
                const sleepDelay =
                    this.retryAttempts[requestHash].count * this.options.retryOptions.exponentialBackoffMultiplier;
                await sleep(sleepDelay);
            }
            this.retryAttempts[requestHash].count += 1;
            return await this.sendRequest(config, requestHash);
        }
        delete this.retryAttempts[requestHash];
        throw err;
    }
}
