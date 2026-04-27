import jwt from "jsonwebtoken";

const cookieName = "redo_admin_token";
const secret = process.env.ADMIN_SESSION_SECRET || "redo-admin-secret";

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
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 12,
    path: "/",
  };
}

export function createAdminSession(response) {
  const token = jwt.sign({ role: "admin" }, secret, { expiresIn: "12h" });
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
    return jwt.verify(token, secret);
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
