import axios, { AxiosError } from 'axios';
import { AxiosDigest as DigestAuth } from './index';

describe('Axios Digest Tests', () => {
    describe('GET', () => {
        it('should succeed with correct username and password', async () => {
            const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
            const res = await axiosDigest.get('http://localhost:1337/testing');
            expect(res).toBeDefined();
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
    describe('POST', () => {
        it('should succeed with correct username and password', async () => {
            const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
            const res = await axiosDigest.post('http://localhost:1337/testing', { test: true });
            expect(res).toBeDefined();
        });
        it('should fail with incorrect password', async () => {
            const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
            try {
                await axiosDigest.post('http://localhost:1337/testing', { test: true });
            } catch (e) {
                const err = e as AxiosError;
                expect(err.response).toBeDefined();
                expect(err.response!.status).toEqual(401);
            }
        });
        it('should fail with incorrect username', async () => {
            const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
            try {
                await axiosDigest.post('http://localhost:1337/testing', { test: true });
            } catch (e) {
                const err = e as AxiosError;
                expect(err.response).toBeDefined();
                expect(err.response!.status).toEqual(401);
            }
        });
    });
    describe('PATCH', () => {
        it('should succeed with correct username and password', async () => {
            const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
            const res = await axiosDigest.patch('http://localhost:1337/testing', { test: true });
            expect(res).toBeDefined();
        });
        it('should fail with incorrect password', async () => {
            const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
            try {
                await axiosDigest.patch('http://localhost:1337/testing', { test: true });
            } catch (e) {
                const err = e as AxiosError;
                expect(err.response).toBeDefined();
                expect(err.response!.status).toEqual(401);
            }
        });
        it('should fail with incorrect username', async () => {
            const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
            try {
                await axiosDigest.patch('http://localhost:1337/testing', { test: true });
            } catch (e) {
                const err = e as AxiosError;
                expect(err.response).toBeDefined();
                expect(err.response!.status).toEqual(401);
            }
        });
    });
    describe('PUT', () => {
        it('should succeed with correct username and password', async () => {
            const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
            const res = await axiosDigest.put('http://localhost:1337/testing', { test: true });
            expect(res).toBeDefined();
        });
        it('should fail with incorrect password', async () => {
            const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
            try {
                await axiosDigest.put('http://localhost:1337/testing', { test: true });
            } catch (e) {
                const err = e as AxiosError;
                expect(err.response).toBeDefined();
                expect(err.response!.status).toEqual(401);
            }
        });
        it('should fail with incorrect username', async () => {
            const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
            try {
                await axiosDigest.put('http://localhost:1337/testing', { test: true });
            } catch (e) {
                const err = e as AxiosError;
                expect(err.response).toBeDefined();
                expect(err.response!.status).toEqual(401);
            }
        });
    });
    describe('DELETE', () => {
        it('should succeed with correct username and password', async () => {
            const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
            const res = await axiosDigest.delete('http://localhost:1337/testing');
            expect(res).toBeDefined();
        });
        it('should fail with incorrect password', async () => {
            const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
            try {
                await axiosDigest.delete('http://localhost:1337/testing');
            } catch (e) {
                const err = e as AxiosError;
                expect(err.response).toBeDefined();
                expect(err.response!.status).toEqual(401);
            }
        });
        it('should fail with incorrect username', async () => {
            const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
            try {
                await axiosDigest.delete('http://localhost:1337/testing');
            } catch (e) {
                const err = e as AxiosError;
                expect(err.response).toBeDefined();
                expect(err.response!.status).toEqual(401);
            }
        });
    });
    describe('HEAD', () => {
        it('should succeed with correct username and password', async () => {
            const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
            const res = await axiosDigest.head('http://localhost:1337/testing');
            expect(res).toBeDefined();
        });
        it('should fail with incorrect password', async () => {
            const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
            try {
                await axiosDigest.head('http://localhost:1337/testing');
            } catch (e) {
                const err = e as AxiosError;
                expect(err.response).toBeDefined();
                expect(err.response!.status).toEqual(401);
            }
        });
        it('should fail with incorrect username', async () => {
            const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
            try {
                await axiosDigest.head('http://localhost:1337/testing');
            } catch (e) {
                const err = e as AxiosError;
                expect(err.response).toBeDefined();
                expect(err.response!.status).toEqual(401);
            }
        });
    });
});
