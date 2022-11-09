/**
 * Supported HTTP methods
 */
export enum Method {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    PUT = 'PUT',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
}

/**
 * Supported Algorithms used for digest authentication
 */
export enum Algorithm {
    MD5 = 'md5',
    SHA256 = 'sha256',
    SHA512 = 'sha512',
}

/**
 * Shape of constructor `options` object
 */
export interface Options {
    /**
     * Object used to fine-tune retry logic for specific needs
     */
    retryOptions: {
        /**
         * The number of retry attempts to execute for a retriable request
         */
        attempts?: number;
        /**
         * A list of HTTP status codes to exclude from retry logic
         */
        excludedStatusCodes?: number[];
        /**
         * The multiplier (in milliseconds) used to create the wait time for exponential backoff retries
         *
         * @example
         * retry1 = 1 * 1000 = 1 second
         * retry2 = 2 * 1000 = 2 seconds
         */
        exponentialBackoffMultiplier?: number;
        /**
         * A list of HTTP status codes that, when receieved in a response, will be retried with exponential backoff
         */
        exponentialBackoffEnabledStatusCodes: number[];
    };
    /**
     * Whether or not retries are enabled. If false, no requests will be retried, regardless of the status code
     */
    retry: boolean;
    /**
     * Max timeout duration for requests (can also be set on a per-request basis with AxiosRequestConfig)
     */
    timeout: number;
}

/**
 * Shape of `www-authenticate` header object
 */
export interface AuthDetails {
    realm: string;
    nonce: string;
    qop?: string;
    algorithm?: Algorithm;
    opaque?: string;
    stale?: string;
    domain?: string; // not implemented
    charset?: string; // not implemented
    userhash?: string; // not implemented
}
