import { AxiosInstance, AxiosStatic } from 'axios';

/**
 * Supported HTTP clients
 */
export type HTTPClient = {
    axios: AxiosInstance | AxiosStatic;
};
/**
 * Utility type for type-safe inheritance of the base digest class
 */
export type SupportedHTTPClient = HTTPClient['axios'];

/**
 * Supported HTTP methods
 */
export const Method = {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    PUT: 'PUT',
    DELETE: 'DELETE',
    HEAD: 'HEAD',
} as const;

/**
 * Supported HTTP methods
 */
export type Method = typeof Method[keyof typeof Method];

/**
 * Supported Algorithms used for digest authentication
 */
export const Algorithm = {
    MD5: 'md5',
} as const;

/**
 * Supported Algorithms used for digest authentication
 */
export type Algorithm = typeof Algorithm[keyof typeof Algorithm];

/**
 * Shape of `www-authenticate` header object
 * https://httpwg.org/specs/rfc9110.html#field.www-authenticate
 */
export type AuthDetails = {
    realm: string;
    nonce: string;
    qop?: string;
    algorithm?: Algorithm;
    opaque?: string;
    stale?: string;
    domain?: string; // not implemented, barely adopted by anything
    charset?: string; // not implemented, barely adopted by anything
    userhash?: string; // not implemented, barely adopted by anything
};
