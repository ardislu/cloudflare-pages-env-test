function base64UrlEncode(s) {
  return btoa(s)
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_');
}

async function sign(message, privateKey) {
  const cleanedKey = privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replaceAll(/\r\n|\n|\r/g, '');
  const keyBuffer = Uint8Array.from(atob(cleanedKey), c => c.charCodeAt(0));

  const signingKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    {
      name: 'RSASSA-PKCS1-V1_5',
      hash: 'SHA-256'
    },
    true,
    ['sign']
  );

  return base64UrlEncode(String.fromCharCode(...new Uint8Array(await crypto.subtle.exportKey('pkcs8', signingKey))));

  // const signatureBuffer = await crypto.subtle.sign('RSASSA-PKCS1-V1_5', signingKey, message);
  // return base64UrlEncode(String.fromCharCode(...new Uint8Array(signatureBuffer)));
}

export async function onRequestGet() {
  const privateKey = 'MIIBVgIBADANBgkqhkiG9w0BAQEFAASCAUAwggE8AgEAAkEAq7BFUpkGp3+LQmlQYx2eqzDV+xeG8kx/sQFV18S5JhzGeIJNA72wSeukEPojtqUyX2J0CciPBh7eqclQ2zpAswIDAQABAkAgisq4+zRdrzkwH1ITV1vpytnkO/NiHcnePQiOW0VUybPyHoGM/jf75C5xET7ZQpBe5kx5VHsPZj0CBb3b+wSRAiEA2mPWCBytosIU/ODRfq6EiV04lt6waE7I2uSPqIC20LcCIQDJQYIHQII+3YaPqyhGgqMexuuuGx+lDKD6/Fu/JwPb5QIhAKthiYcYKlL9h8bjDsQhZDUACPasjzdsDEdq8inDyLOFAiEAmCr/tZwA3qeAZoBzI10DGPIuoKXBd3nk/eBxPkaxlEECIQCNymjsoI7GldtujVnr1qT+3yedLfHKsrDVjIT3LsvTqw==';
  const signature = await sign('TEST MESSAGE', privateKey);
  return new Response(signature);
}
