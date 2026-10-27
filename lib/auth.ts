import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "am_admin";
const WEEK = 7 * 24 * 60 * 60;

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 16) throw new Error("ADMIN_SECRET must be set (at least 16 characters)");
  return s;
}

const sign = (value: string) => crypto.createHmac("sha256", secret()).update(value).digest("hex");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET);

export function checkPassword(input: string) {
  const real = process.env.ADMIN_PASSWORD;
  return Boolean(real) && safeEqual(input, real!);
}

/** The cookie holds "<expiry>.<hmac(expiry)>", so it can't be forged without ADMIN_SECRET. */
export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

export async function createSession() {
  const exp = String(Date.now() + WEEK * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: WEEK,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}
