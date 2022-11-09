import axios, { AxiosError } from 'axios';
import { AxiosDigest as DigestAuth } from './index';

const URL_md5 = 'http://localhost:1337/md5';
const URL_md5Sess = 'http://localhost:1337/md5-sess';

describe('Axios Digest Tests', () => {
    describe('MD5', () => {
        describe('GET', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.get(URL_md5);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.get(URL_md5);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.get(URL_md5);
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('POST', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.post(URL_md5, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.post(URL_md5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.post(URL_md5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('PATCH', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.patch(URL_md5, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.patch(URL_md5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.patch(URL_md5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('PUT', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.put(URL_md5, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.put(URL_md5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.put(URL_md5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('DELETE', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.delete(URL_md5);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.delete(URL_md5);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.delete(URL_md5);
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('HEAD', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.head(URL_md5);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.head(URL_md5);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.head(URL_md5);
                }).rejects.toThrow(AxiosError);
            });
        });
    });
    describe('MD5-SESS', () => {
        describe('GET', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.get(URL_md5Sess);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.get(URL_md5Sess);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.get(URL_md5Sess);
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('POST', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.post(URL_md5Sess, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.post(URL_md5Sess, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.post(URL_md5Sess, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('PATCH', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.patch(URL_md5Sess, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.patch(URL_md5Sess, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.patch(URL_md5Sess, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('PUT', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.put(URL_md5Sess, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.put(URL_md5Sess, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.put(URL_md5Sess, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('DELETE', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.delete(URL_md5Sess);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.delete(URL_md5Sess);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.delete(URL_md5Sess);
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('HEAD', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.head(URL_md5Sess);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.head(URL_md5Sess);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.head(URL_md5Sess);
                }).rejects.toThrow(AxiosError);
            });
        });
    });
});
