import axios from 'axios';
import { AxiosDigest as DigestAuth } from './index';

describe('Axios Digest', () => {
    it('should work :)', async () => {
        const axiosDigest = new DigestAuth('test', 'test', axios.create(), { retry: true });
        const res = await axiosDigest.get('http://localhost:1337/testing');
        expect(res).not.toBe(undefined);
    });
});
