# cloudflare-pages-env-test

When run locally, the `crypto.subtle.sign` function works as expected. After running:
```
npx wrangler pages dev .
```

Visiting http://localhost:8788/ returns:
```
G3LiJGjMWZJ2gh9xMMUt-mrXDEXdc5w_eGpaqM4cTLQ0k3OF73rWJqkc99yuzlKwzluXNjxG7O5jxBxEqS7vqw
```

However when the same code is deployed to Cloudflare Pages, it no longer works: https://cloudflare-pages-env-test.pages.dev/

## Workaround

This issue is due to an inconsistency with the Node.js polyfill for `crypto.subtle.sign`. The code:
```
crypto.subtle.sign('RSASSA-PKCS1-V1_5', signingKey, message)
```
should throw an error, but doesn't. Instead, use:
```
crypto.subtle.sign('RSASSA-PKCS1-V1_5', signingKey, new TextEncoder().encode(message))
```
and both the local and the deployed site will work as desired.
