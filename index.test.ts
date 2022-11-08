import axios, { AxiosError } from 'axios';
import { AxiosDigest as DigestAuth } from './index';

describe('Axios Digest', () => {
    it('should work :)', async () => {
        const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
        const res = await axiosDigest.get('http://localhost:1337/testing');
        expect(res).not.toBe(undefined);
    });
    it('should fail with incorrect password', async () => {
        const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
        try {
            await axiosDigest.get('http://localhost:1337/testing');
        } catch (e) {
            const err = e as AxiosError;
            expect(err.response).toBeDefined();
            expect(err.response!.status).toEqual(401);
        }
    });
    it('should fail with incorrect username', async () => {
        const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
        try {
            await axiosDigest.get('http://localhost:1337/testing');
        } catch (e) {
            const err = e as AxiosError;
            expect(err.response).toBeDefined();
            expect(err.response!.status).toEqual(401);
        }
    });
});
