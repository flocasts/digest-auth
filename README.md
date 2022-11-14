# Digest Authentication Helper For Axios

This repo exists because the axios library does not support digest authentication.

## Installation

`npm i @flocasts/axios-digest`

## Usage

```typescript
import axios from 'axios';
import DigestAuth from '@flocasts/axios-digest';

const axiosDigest = new DigestAuth('<username>', '<passwd>', axios, {
    retry: true,
    retryOptions: {
        attempts: 10,
        excludedStatusCodes: [404],
        exponentialBackupMultiplier: 1000,
    },
});

const result = await axiosDigest.get('http://localhost:3000/test');
```

## Testing

using the [concurrently](https://github.com/open-cli-tools/concurrently) package, we are able to spin up a test server to test our digest-auth solution, and close the test server on completion of tests.
to test, simply run:

```bash
npm run test
```

## Supported HTTP Methods

-   [x] GET
-   [x] POST
-   [x] PATCH
-   [x] PUT
-   [x] DELETE
-   [x] HEAD
-   [ ] CONNECT
-   [ ] OPTIONS
-   [ ] TRACE

## Help, something I need isn't supported!

It's okay - PRs are open!
