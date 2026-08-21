"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authApi, useLoginMutation, useGetCurrentUserQuery } from "./api";
import { setTokenCookie, getTokenCookie, clearTokenCookie } from "@/lib/cookies";

// the current user is server data (fetched from /auth/me), so it lives in
// the RTK Query cache instead of a plain slice. the token cookie is what
// actually gates whether this runs at all
export function useCurrentUser() {
  const hasToken = typeof document !== "undefined" && Boolean(getTokenCookie());
  return useGetCurrentUserQuery(undefined, { skip: !hasToken });
}

export function useLogin() {
  const dispatch = useDispatch();
  const [trigger, state] = useLoginMutation();

  async function login(credentials) {
    const data = await trigger(credentials).unwrap();
    setTokenCookie(data.token);
    // seeds the cache immediately so useCurrentUser() reflects the logged
    // in user right away instead of firing a redundant /auth/me request
    dispatch(authApi.util.upsertQueryData("getCurrentUser", undefined, data.user));
    return data;
  }

  return { login, isPending: state.isLoading };
}

export function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();

  return function logout() {
    clearTokenCookie();
    dispatch(authApi.util.resetApiState());
    router.push("/login");
  };
}

// proxy.js can only check that the session cookie exists, not that the JWT
// inside it still works (no signing secret on our side), so a stale or
// tampered token gets past it and lands here. if /auth/me actually rejects
// the token, this clears it and finishes the trip back to /login that a
// hard refresh would've gotten for free from proxy.js
export function useSessionGuard() {
  const { isError } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isError && getTokenCookie() && pathname !== "/login") {
      clearTokenCookie();
      dispatch(authApi.util.resetApiState());
      router.replace("/login");
    }
  }, [isError, pathname, router, dispatch]);
}
