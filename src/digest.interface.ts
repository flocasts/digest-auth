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
    retryOptions: {
        attempts?: number;
        excludedStatusCodes?: number[];
        exponentialBackupMultiplier?: number;
    };
    retry: boolean;
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
