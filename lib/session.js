import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "jv_session";

// Lazy so importing this module never requires SESSION_SECRET to be present
// (see lib/db.js) — and fails loudly if it's ever actually missing at
// request time, rather than silently signing with an empty/garbage secret.
let secret;
function getSecret() {
  if (!secret) {
    if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set");
    secret = new TextEncoder().encode(process.env.SESSION_SECRET);
  }
  return secret;
}

export async function createSession(email, role = "user") {
  const token = await new SignJWT({ email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
