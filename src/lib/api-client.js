import { getTokenCookie } from "./cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

// Thin wrapper around fetch for the given backend. Handles the base URL,
// the auth header, and unwraps the { error: { message, code } } shape the
// API returns on failure so callers can just catch ApiError. Every
// feature's api.js goes through this instead of calling fetch directly.
export async function apiFetch(path, { method = "GET", body, token, params } = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    }
  }

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // /messages returns a bare `null` body on some error paths instead of an
  // error object, so this can't assume res.json() always gives us `{error}`.
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.error?.message ?? "Something went wrong. Please try again.", {
      status: res.status,
      code: data?.error?.code,
    });
  }

  return data;
}

// Adapts apiFetch to RTK Query's baseQuery contract, so every feature's
// createApi() goes through this instead of duplicating the same adapter or
// reaching for RTK Query's own fetchBaseQuery.
export async function rtkBaseQuery(args) {
  const { url, method = "GET", body, params } = typeof args === "string" ? { url: args } : args;

  try {
    const data = await apiFetch(url, { method, body, params, token: getTokenCookie() });
    return { data };
  } catch (err) {
    return { error: { status: err.status, message: err.message, code: err.code } };
  }
}
