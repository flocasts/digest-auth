import axios, { AxiosError } from 'axios';
import { AxiosDigest as DigestAuth } from '../index';

enum URL {
    MD5 = 'http://localhost:1337/md5',
    MD5_SESS = 'http://localhost:1337/md5-sess',
    ERR_408 = 'http://localhost:1337/four-zero-eight',
    ERR_404 = 'http://localhost:1337/four-zero-four',
    ERR_504 = 'http://localhost:1337/five-zero-four',

    // server utility endpoints
    RESET_COUNT = 'http://localhost:1337/reset-count',
    SET_COUNT = 'http://localhost:1337/set-count',
    GET_COUNT = 'http://localhost:1337/get-count',
}

// these are just to make sure the server utility endpoints are working
describe('utils tests', () => {
    it('should reset count', async () => {
        const axiosDigest = new DigestAuth('test', 'test', axios.create());
        await axiosDigest.get<void>(URL.SET_COUNT);
        const count1 = await axiosDigest.get<number>(URL.GET_COUNT);
        expect(count1.data).toEqual(33);
        await axiosDigest.get<void>(URL.RESET_COUNT);
        const count2 = await axiosDigest.get<number>(URL.GET_COUNT);
        expect(count2.data).toEqual(0);
    });
});

describe('Axios Digest Tests', () => {
    describe('MD5', () => {
        describe('GET', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.get(URL.MD5);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.get(URL.MD5);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.get(URL.MD5);
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('POST', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.post(URL.MD5, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.post(URL.MD5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.post(URL.MD5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('PATCH', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.patch(URL.MD5, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.patch(URL.MD5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.patch(URL.MD5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('PUT', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.put(URL.MD5, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.put(URL.MD5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.put(URL.MD5, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('DELETE', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.delete(URL.MD5);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.delete(URL.MD5);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.delete(URL.MD5);
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('HEAD', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.head(URL.MD5);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.head(URL.MD5);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.head(URL.MD5);
                }).rejects.toThrow(AxiosError);
            });
        });
    });
    describe('MD5-SESS', () => {
        describe('GET', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.get(URL.MD5_SESS);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.get(URL.MD5_SESS);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.get(URL.MD5_SESS);
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('POST', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.post(URL.MD5_SESS, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.post(URL.MD5_SESS, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.post(URL.MD5_SESS, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('PATCH', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.patch(URL.MD5_SESS, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.patch(URL.MD5_SESS, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.patch(URL.MD5_SESS, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('PUT', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.put(URL.MD5_SESS, { test: true });
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.put(URL.MD5_SESS, { test: true });
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.put(URL.MD5_SESS, { test: true });
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('DELETE', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.delete(URL.MD5_SESS);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.delete(URL.MD5_SESS);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.delete(URL.MD5_SESS);
                }).rejects.toThrow(AxiosError);
            });
        });
        describe('HEAD', () => {
            it('should succeed with correct username and password', async () => {
                const axiosDigest = new DigestAuth('test', 'test', axios.create());
                const res = await axiosDigest.head(URL.MD5_SESS);
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            it('should fail with incorrect password', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('test', 'wrong-password', axios.create());
                    await axiosDigest.head(URL.MD5_SESS);
                }).rejects.toThrow(AxiosError);
            });
            it('should fail with incorrect username', async () => {
                expect(async () => {
                    const axiosDigest = new DigestAuth('wrong-username', 'test', axios.create());
                    await axiosDigest.head(URL.MD5_SESS);
                }).rejects.toThrow(AxiosError);
            });
        });
    });
});

// These tests don't use digest authentication, but the package allows for requests
// without digest auth as well, so we can get http retries with or without handling digest.
describe('Axios Retry Tests', () => {
    it('retries 10 times', async () => {
        const axiosDigest = new DigestAuth('test', 'test', axios.create(), {
            retry: true,
            retryOptions: { attempts: 10, excludedStatusCodes: [] },
        });
        await axiosDigest.get<void>(URL.RESET_COUNT);
        const count = await axiosDigest.get<number>(URL.GET_COUNT);
        expect(count.data).toEqual(0);
        await axiosDigest.get<void>(URL.ERR_408);
        const count2 = await axiosDigest.get<number>(URL.GET_COUNT);
        expect(count2.data).toEqual(10);
    });
    it('should exclude excluded status codes from retry', async () => {
        const axiosDigest = new DigestAuth('test', 'test', axios.create(), {
            retry: true,
            retryOptions: { attempts: 10, excludedStatusCodes: [404] },
        });
        // need to reset count after each request that deals with the counter in the server
        // kinda rudimetry but simple and works.
        try {
            await axiosDigest.get(URL.RESET_COUNT);
        } catch (e: any) {
            console.log('error while reseting count');
            expect(1).toEqual(2);
        }

        try {
            await axiosDigest.get(URL.ERR_404);
        } catch (e: any) {
            const err = e as AxiosError;
            if (err.isAxiosError) {
                expect(err.response?.status).toEqual(404);
                expect(+err.response?.headers.count!).toEqual(1);
            }
        }
    });
    it('should not exclude status codes that are not marked as excluded', async () => {
        const axiosDigest = new DigestAuth('test', 'test', axios.create(), {
            retry: true,
            retryOptions: { attempts: 5, excludedStatusCodes: [408] },
        });
        try {
            // need to reset count after each request that deals with the counter in the server
            // kinda rudimetry but simple and works.
            const res = await axiosDigest.get(URL.RESET_COUNT);
            expect(res.status).toEqual(200);
        } catch (e: any) {
            console.log('error while resetting count');
            expect(1).toEqual(2);
        }

        try {
            await axiosDigest.get(URL.ERR_404);
        } catch (e: any) {
            const err = e as AxiosError;
            if (err.isAxiosError) {
                expect(err.response?.status).toEqual(404);
                expect(+err.response?.headers.count!).toEqual(5);
            }
        }
    });
    it('should perform exponential backoff correctly', async () => {
        const axiosDigest = new DigestAuth('test', 'test', axios.create(), {
            retry: true,
            retryOptions: {
                attempts: 10,
                exponentialBackoffEnabledStatusCodes: [504],
                exponentialBackoffMultiplier: 50,
            },
            timeout: 60 * 1000,
        });
        const startTime = new Date();

        try {
            await axiosDigest.get(URL.ERR_504);
        } catch (e: any) {
            const endTime = new Date();
            const err = e as AxiosError;
            if (err.isAxiosError) {
                expect(err.response?.status).toEqual(504);
                expect(+endTime - +startTime).toBeGreaterThan(1800);
                // need to give small buffer on this, logic might take up to 200ms
                expect(+endTime - +startTime).toBeLessThan(2000);
            }
        }
    });
});
