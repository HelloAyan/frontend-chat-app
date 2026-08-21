// The JWT the API hands back is valid for 7 days (checked its exp claim
// against iat while probing the API), so the cookie is set to match.
const TOKEN_COOKIE = "chat_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export function setTokenCookie(token) {
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE}; samesite=lax`;
}

export function getTokenCookie() {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearTokenCookie() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

export const TOKEN_COOKIE_NAME = TOKEN_COOKIE;
