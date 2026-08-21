import { createApi } from "@reduxjs/toolkit/query/react";
import { apiFetch } from "@/lib/api-client";
import { getTokenCookie } from "@/lib/cookies";

// adapts the existing apiFetch wrapper to RTK Query's baseQuery contract, so
// every endpoint still goes through the same centralized fetch logic (base
// URL, auth header, the { error: { message, code } } unwrapping) instead of
// RTK Query's own fetchBaseQuery
async function apiBaseQuery(args) {
  const { url, method = "GET", body, params } = typeof args === "string" ? { url: args } : args;

  try {
    const data = await apiFetch(url, { method, body, params, token: getTokenCookie() });
    return { data };
  } catch (err) {
    return { error: { status: err.status, message: err.message, code: err.code } };
  }
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["CurrentUser"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["CurrentUser"],
    }),
    getCurrentUser: builder.query({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["CurrentUser"],
    }),
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;
