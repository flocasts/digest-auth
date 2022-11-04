# Flo Digest Authentication Helper For Axios

This repo exists because the axios library does not support digest authentication.

## Installation

`npm i @flocasts/flo-headers`

## Usage

```typescript
import axios from 'axios';
import DigestAuth from '@flocasts/flo-axios-digest';

const axiosDigest = new DigestAuth('<username>', '<passwd>', axios.create());

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
