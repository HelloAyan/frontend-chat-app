const API_BASE_URL = "https://frontend-task-chatapp.onrender.com/api";

export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

// Thin wrapper around fetch for the given backend. Handles the base URL,
// the auth header, and unwraps the { error: { message, code } } shape the
// API returns on failure so callers can just catch ApiError.
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
