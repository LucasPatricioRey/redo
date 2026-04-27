import jwt from "jsonwebtoken";

const cookieName = "redo_admin_token";
const secret = process.env.ADMIN_SESSION_SECRET || "redo-admin-secret";

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
  response.cookie(cookieName, token, getCookieOptions());
}

export function clearAdminSession(response) {
  response.clearCookie(cookieName, { path: "/" });
}

export function readAdminSession(request) {
  const token = request.cookies?.[cookieName];

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
