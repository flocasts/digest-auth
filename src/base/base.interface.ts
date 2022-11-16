import { AxiosInstance, AxiosStatic } from 'axios';

/**
 * Supported HTTP clients
 */
export interface HTTPClient {
    axios: AxiosInstance | AxiosStatic;
}
/**
 * Utility type for type-safe inheritance of the base digest class
 */
export type SupportedHTTPClient = HTTPClient['axios'];

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
}

/**
 * Shape of `www-authenticate` header object
 * https://httpwg.org/specs/rfc9110.html#field.www-authenticate
 */
export interface AuthDetails {
    realm: string;
    nonce: string;
    qop?: string;
    algorithm?: Algorithm;
    opaque?: string;
    stale?: string;
    domain?: string; // not implemented, barely adopted by anything
    charset?: string; // not implemented, barely adopted by anything
    userhash?: string; // not implemented, barely adopted by anything
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
         * A list of HTTP status codes that, when received in a response, will be retried with an exponential backoff
         */
        exponentialBackoffEnabledStatusCodes?: number[];
    };
    /**
     * Whether or not retries are enabled. If false, no requests will be retried, regardless of the status code
     */
    retry: boolean;
    /**
     * Max timeout duration for requests
     */
    timeout: number;
}
