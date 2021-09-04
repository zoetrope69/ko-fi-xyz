import { serialize } from "cookie";

export const AUTH_TOKEN_NAME = "ko-fi-alerts-token";
const MAX_AGE = 60 * 60 * 8;

export function removeAuthCookies(res) {
  const expireConfig = {
    maxAge: 0,
    expires: new Date(Date.now() - MAX_AGE),
  };

  res.setHeader("Set-Cookie", [
    createCookie(AUTH_TOKEN_NAME, "", expireConfig),
    createCookie("authed", "", expireConfig),
  ]);
}

export function createCookie(name, data, options = {}) {
  return serialize(name, data, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    ...options,
  });
}

export function setTokenCookie(res, token) {
  res.setHeader("Set-Cookie", [
    createCookie(AUTH_TOKEN_NAME, token),
    createCookie("authed", true, { httpOnly: false }),
  ]);
}

export function getAuthToken(cookies) {
  return cookies[AUTH_TOKEN_NAME];
}
