import { Algorithm, AuthDetails } from './base.interface';
import * as crypto from 'crypto';

/**
 * Pause execution for ms milliseconds
 * @param ms number of milliseconds to wait/sleep
 */
export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve();
        }, ms),
    );
}

/**
 * Parse and shape `www-authenticate` HTTP header into javascript object
 * @param header Value of `www-authenticate` HTTP header
 * @returns Object of type AuthDetails
 */
export function getAuthDetails(header: string): AuthDetails {
    const withoutDigestKeyword = header.replace('Digest ', '');
    let authDetailsString = withoutDigestKeyword
        .replace(/{|}/g, '')
        .split(',')
        .map((val) => {
            const [key, value] = val.split('=');
            return `"${key.trim()}":${value}`;
        })
        .join(',');
    authDetailsString = `{${authDetailsString}}`;
    return JSON.parse(authDetailsString);
}

/**
 * Parse the value of `algorithm` to determine which algorithm to use, and the shape of the ha1 hash
 * @param algorithm Value of `algorithm` from the `www-authenticate` response header
 * @returns Object containing the algorithm used, and whether or not the algorithm had `-sess` appended
 */
export function getAlgorithm(algorithm: string): { algo: Algorithm; useSess: boolean } {
    const parts = algorithm?.toLowerCase().split('-');
    return { algo: parts[0] as Algorithm, useSess: parts[1] && parts[1].toLowerCase() === 'sess' ? true : false };
}

/**
 * Hash and return hex string for ha1 portion of final digest-auth response hash
 * @param username The username for digest-auth user
 * @param password The password for digest-auth user
 * @param algo The algorithm to use for hashing
 * @param useSess Whether or not `-sess` was appended to the original value of `algorithm` in the `www-authenticate` response header
 * @param realm The realm value from the `www-authenticate` response header
 * @param nonce The `number only used once` value from the `www-authenticate` response header
 * @param cnonce An alphanumeric string with 8 chars
 * @returns Hex string result of hashing all necessary params
 */
export function createHa1(
    username: string,
    password: string,
    algo: Algorithm,
    useSess: boolean,
    realm: string,
    nonce: string,
    cnonce: string,
): string {
    const { hash, encoding } = getHashBaseByAlgo(algo);
    if (!useSess) {
        return hash.update(`${username}:${realm}:${password}`).digest(encoding);
    } else {
        const body = hash.update(`${username}:${realm}:${password}`).digest(encoding);
        const { hash: newHash } = getHashBaseByAlgo(algo);
        return newHash.update(`${body}:${nonce}:${cnonce}`).digest(encoding);
    }
}

/**
 * Hash and return hex string for ha2 portion of final digest-auth response hash
 * @param algo The algorithm to use for hashing
 * @param qop `Quality of Protection` value from the `www-authenticate` response header
 * @param method HTTP method used for the request
 * @param path HTTP relative path to server endpoint, found in url
 * @param data Any and all data being sent with this request
 * @returns Hex string result of hassing all necessary pararms
 */
export function createHa2(algo: Algorithm, qop: string, method: string, path: string, data: any): string {
    const { hash, encoding } = getHashBaseByAlgo(algo);
    const stringData = JSON.stringify(data);

    if (qop === 'auth' || qop == undefined) {
        return hash.update(`${method}:${path}`).digest(encoding);
    } else if (qop === 'auth-int') {
        const body: string = hash.update(`${stringData}`).digest(encoding);
        return hash.update(`${method}:${path}:${body}`).digest(encoding);
    }
    throw new Error(`createHa2: Invalid 'qop' value: ${qop}`);
}

/**
 * Hash and return hex string for response portion of HTTP `authorization` header string being sent for digest-auth
 * @param algo The algorithm to use for hashing
 * @param ha1 Hex string of hashed data for first position of digest response hash
 * @param ha2 Hex string of hashed data for last position of digest response hash
 * @param nonce The `number only used once` (per request) value from the `www-authenticate` response header
 * @param nonceCount count of times this nonce has been used (effected by retries)
 * @param cnonce An alphanumeric string with 8 chars
 * @param qop `Quality of Protection` value from the `www-authenticate` response header
 * @returns
 */
export function createDigestResponse(
    algo: Algorithm,
    ha1: string,
    ha2: string,
    nonce: string,
    nonceCount: string,
    cnonce: string,
    qop: string,
): string {
    const { hash, encoding } = getHashBaseByAlgo(algo);

    if (qop.toLowerCase() === 'auth' || qop.toLowerCase() === 'auth-int') {
        return hash.update(`${ha1}:${nonce}:${nonceCount}:${cnonce}:${qop}:${ha2}`).digest(encoding);
    } else {
        return hash.update(`${ha1}:${nonce}:${ha2}`).digest(encoding);
    }
}

/**
 * Create crypto Hash based on the supplied algorithm
 * @param algo The algorithm to use for hashing
 * @returns crypto Hash object, and the encoding to use based on the algorithm
 */
export function getHashBaseByAlgo(algo: Algorithm): { hash: crypto.Hash; encoding: 'base64' | 'hex' } {
    switch (algo) {
        case Algorithm.SHA256:
            return { hash: crypto.createHash('sha256'), encoding: 'base64' };
        case Algorithm.SHA512:
            return { hash: crypto.createHash('sha512'), encoding: 'base64' };
        case Algorithm.MD5:
        default:
            return { hash: crypto.createHash('md5'), encoding: 'hex' };
    }
}

export function getUniqueRequestHash(): string {
    return crypto
        .createHash('sha256')
        .update(`${+Date.now()}`)
        .digest('hex');
}
