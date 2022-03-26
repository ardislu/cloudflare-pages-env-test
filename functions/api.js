export function onRequestGet({ env }) {
  return new Response(JSON.stringify({
    email: env.EMAIL,
    privateKey: env.PRIVATE_KEY,
    scopes: env.SCOPES
  }));
}
