import { apiFetch } from "./apiClient";

export function login({ phone, name }) {
  return apiFetch("/auth/login", { method: "POST", body: { phone, name } });
}

export function getCurrentUser(token) {
  return apiFetch("/auth/me", { token });
}
