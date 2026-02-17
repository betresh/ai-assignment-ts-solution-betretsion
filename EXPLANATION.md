## What was the bug?

`HttpClient.request()` failed to attach or refresh an OAuth2 authorization header when `oauth2Token` was a plain object (e.g. `{ accessToken, expiresAt }`). The code only refreshed or read the token when it was either falsy or an instance of `OAuth2Token`, so plain-object tokens were treated as valid but stale.

## Why did it happen?

The implementation relied on `instanceof OAuth2Token` to check expiry and produce the header. A token stored as a plain object passes the truthiness check but lacks the class methods/properties behavior the code expects, so expired/stale tokens were never refreshed and no `Authorization` header was produced.

## Why does the fix solve it?

The fix normalizes plain-object tokens that expose `accessToken` and `expiresAt` into `OAuth2Token` instances before proceeding. That reuses the existing expiry and header logic, ensuring stale or missing tokens are refreshed and a proper `Authorization` header is set.

## One realistic case / edge case our tests still don’t cover

We do not cover malformed token objects (missing `accessToken` or non-numeric `expiresAt`), token objects with different property names, or asynchronous refresh behavior (e.g. refresh that returns a Promise). Those cases would require additional validation and async handling.
