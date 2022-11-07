# Flo Digest Authentication Helper For Axios

This repo exists because the axios library does not support digest authentication.

## Installation

`npm i @flocasts/flo-headers`

## Usage

```typescript
import axios from 'axios';
import DigestAuth from '@flocasts/flo-axios-digest';

const axiosDigest = new DigestAuth(
    '<username>',
    '<passwd>',
    <axios | axios.create()>,
    { retry: true, retry_times: 10, timeout: 10000 },
);

const result = await axiosDigest.get('http://localhost:3000/test');
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
