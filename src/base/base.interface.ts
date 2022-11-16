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

export interface DigestRequest {
    retryCount: number;
    hasRetried401: boolean;
    cnonce: string;
}

export type DigestRequestMap = Map<string, DigestRequest>;

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
