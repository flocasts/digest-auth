# Digest Authentication

This repo exists to add support for digest authentication when using the Axios HTTP client.
Adding support for other HTTP clients is possible as well!

## Installation

```bash
npm i @flocasts/digest-auth
```

## Usage (with Axios)

```typescript
import axios from 'axios';
import { AxiosDigest as DigestAuth } from '@flocasts/digest-auth';

const axiosDigest = new DigestAuth('<username>', '<passwd>', axios, {
    retry: true,
    retryOptions: {
        attempts: 10,
        excludedStatusCodes: [404],
        exponentialBackoffMultiplier: 1000,
    },
    timeout: 60 * 1000, // 1 minute
});

const result = await axiosDigest.get('http://localhost:3000/test');
```

## Testing

Using the [concurrently](https://github.com/open-cli-tools/concurrently) package, we are able to spin up a test server to test our digest-auth solution, and close the test server on completion of tests.
To test, simply run:

```bash
npm run test
```

## Supported Digest Algorithms

If the server your request is sent to uses an algorithm not supported, you will receive the error:
`algorithm '<algorithm>' not supported`

-   [x] MD5
-   [ ] sha256
-   [ ] sha512

## Supported HTTP Clients

-   [x] [Axios](https://axios-http.com/docs/intro)
-   [ ] [NestJs HTTPModule](https://docs.nestjs.com/techniques/http-module)
-   [ ] [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
-   [ ] [Ajax](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started)
