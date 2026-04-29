import jwt from "jsonwebtoken";
import { env } from "./env.js";

const cookieName = "redo_admin_token";

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${value}`];

  if (options.maxAge) {
    parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  }

  if (options.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options.httpOnly) {
    parts.push("HttpOnly");
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  if (options.secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function applyCookie(response, value) {
  if (typeof response.cookie === "function") {
    response.cookie(cookieName, value.token, value.options);
    return;
  }

  response.setHeader("Set-Cookie", serializeCookie(cookieName, value.token, value.options));
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    maxAge: 1000 * 60 * 60 * 12,
    path: "/",
  };
}

export function createAdminSession(response) {
  const token = jwt.sign({ role: "admin" }, env.adminSessionSecret, { expiresIn: "12h" });
  applyCookie(response, { token, options: getCookieOptions() });
}

export function clearAdminSession(response) {
  if (typeof response.clearCookie === "function") {
    response.clearCookie(cookieName, { path: "/" });
    return;
  }

  response.setHeader(
    "Set-Cookie",
    serializeCookie(cookieName, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "Lax" })
  );
}

export function readAdminSession(request) {
  const cookieHeader = request.headers?.cookie || "";
  const cookies = cookieHeader.split(";").reduce((accumulator, item) => {
    const [key, ...rest] = item.trim().split("=");

    if (!key) {
      return accumulator;
    }

    accumulator[key] = rest.join("=");
    return accumulator;
  }, {});

  const token = request.cookies?.[cookieName] || cookies[cookieName];

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, env.adminSessionSecret);
  } catch (error) {
    return null;
  }
}

export function requireAdmin(request, response, next) {
  const session = readAdminSession(request);

  if (!session) {
    response.status(401).json({ message: "Sesion no autorizada" });
    return;
  }

  next();
}
