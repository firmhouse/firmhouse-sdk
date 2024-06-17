import { SignJWT, jwtVerify } from 'jose';

export async function createAuthToken(token: string): Promise<string> {
  const signingKey = process.env.NEXT_SSC_JWT_SIGNING_KEY;
  if (!signingKey) {
    throw new Error('Signing key is missing');
  }
  const encodedSigningKey = new TextEncoder().encode(signingKey);

  return await new SignJWT({ token })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(encodedSigningKey);
}

export async function verifyAndDecodeAuthToken(token: string): Promise<string> {
  const signingKey = process.env.NEXT_SSC_JWT_SIGNING_KEY;
  if (!signingKey) {
    throw new Error('Signing key is missing');
  }
  const encodedSigningKey = new TextEncoder().encode(signingKey);

  const { payload } = await jwtVerify<{ token: string }>(
    token,
    encodedSigningKey
  );

  return payload?.token;
}
