import axios, { AxiosError } from 'axios';
import { AxiosDigest as DigestAuth } from './index';

describe('Axios Digest Tests', () => {
    describe('MD5', () => {
        describe('GET', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
                const res = await axiosDigest.get('http://localhost:1337/testing');
                expect(res).toBeDefined();
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
                    await axiosDigest.get('http://localhost:1337/testing');
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
                    await axiosDigest.get('http://localhost:1337/testing');
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('POST', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
                const res = await axiosDigest.post('http://localhost:1337/testing', { test: true });
                expect(res).toBeDefined();
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
                    await axiosDigest.post('http://localhost:1337/testing', { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
                    await axiosDigest.post('http://localhost:1337/testing', { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('PATCH', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
                const res = await axiosDigest.patch('http://localhost:1337/testing', { test: true });
                expect(res).toBeDefined();
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
                    await axiosDigest.patch('http://localhost:1337/testing', { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
                    await axiosDigest.patch('http://localhost:1337/testing', { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('PUT', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
                const res = await axiosDigest.put('http://localhost:1337/testing', { test: true });
                expect(res).toBeDefined();
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
                    await axiosDigest.put('http://localhost:1337/testing', { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
                    await axiosDigest.put('http://localhost:1337/testing', { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('DELETE', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
                const res = await axiosDigest.delete('http://localhost:1337/testing');
                expect(res).toBeDefined();
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
                    await axiosDigest.delete('http://localhost:1337/testing');
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
                    await axiosDigest.delete('http://localhost:1337/testing');
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('HEAD', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
                const res = await axiosDigest.head('http://localhost:1337/testing');
                expect(res).toBeDefined();
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create(), { retry: true });
                    await axiosDigest.head('http://localhost:1337/testing');
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create(), { retry: true });
                    await axiosDigest.head('http://localhost:1337/testing');
                }).rejects.toThrow(AxiosError);
            });
        });
    });
});
