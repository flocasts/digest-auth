import { Algorithm, AuthDetails } from './digest.interface';
import * as crypto from 'crypto';

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

export function getAlgorithm(algorithm: string): { algo: Algorithm; useSess: boolean } {
    const parts = algorithm?.toLowerCase().split('-');
    return { algo: parts[0] as Algorithm, useSess: !!parts[1] };
}

export function createHa1(
    username: string,
    password: string,
    algo: Algorithm,
    useSess: boolean,
    realm: string,
    nonce: string,
    cnonce: string,
): string {
    const base = getHashBaseByAlgo(algo);

    let ha1: string = base.update(`${username}:${realm}:${password}`).digest('hex');
    if (useSess) {
        ha1 = base.update(`${ha1}:${nonce}:${cnonce}`).digest('hex');
    }

    return ha1;
}

export function createHa2(algo: Algorithm, qop: string, method: string, path: string, data: string): string {
    const base = getHashBaseByAlgo(algo);

    if (qop === 'auth' || qop == undefined) {
        return base.update(`${method}:${path}`).digest('hex');
    } else if (qop === 'auth-int') {
        const body: string = base.update(`${JSON.stringify(data)}`).digest('hex');
        return base.update(`${method}:${path}:${body}`).digest('hex');
    } else {
        throw new Error(`createHa2: Invalid 'qop' value: ${qop}`);
    }
}

export function createDigestResponse(
    algo: Algorithm,
    ha1: string,
    ha2: string,
    nonce: string,
    nonceCount: string,
    cnonce: string,
    qop: string,
): string {
    const base = getHashBaseByAlgo(algo);

    if (qop.toLowerCase() === 'auth' || qop.toLowerCase() === 'auth-int') {
        return base.update(`${ha1}:${nonce}:${nonceCount}:${cnonce}:${qop}:${ha2}`).digest('hex');
    } else {
        return base.update(`${ha1}:${nonce}:${ha2}`).digest('hex');
    }
}

export function getHashBaseByAlgo(algo: Algorithm): crypto.Hash {
    switch (algo) {
        case Algorithm.SHA256:
            return crypto.createHash('sha256');
        case Algorithm.SHA512:
            return crypto.createHash('sha512');
        case Algorithm.MD5:
        default:
            return crypto.createHash('md5');
    }
}
