import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "redo_admin_session";

function getAdminEnv() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !secret) {
    throw new Error(
      "Faltan ADMIN_USERNAME, ADMIN_PASSWORD o ADMIN_SESSION_SECRET en las variables de entorno.",
    );
  }

  return { username, password, secret };
}

function buildSessionToken() {
  const { username, password, secret } = getAdminEnv();

  return createHmac("sha256", secret)
    .update(`${username}:${password}`)
    .digest("hex");
}

function safeTokenMatch(token: string, expectedToken: string) {
  const current = Buffer.from(token);
  const expected = Buffer.from(expectedToken);

  if (current.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(current, expected);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return safeTokenMatch(token, buildSessionToken());
}

export async function requireAdminAuth() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin-login");
  }
}

export async function signInAdmin(username: string, password: string) {
  const credentials = getAdminEnv();

  if (
    username.trim() !== credentials.username ||
    password.trim() !== credentials.password
  ) {
    return false;
  }

  const store = await cookies();

  store.set(ADMIN_COOKIE_NAME, buildSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return true;
}

export async function signOutAdmin() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
}
