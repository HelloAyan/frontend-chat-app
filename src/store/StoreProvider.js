"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { restoreSession } from "./authSlice";

// pulls the token cookie back into redux (and validates it against /auth/me)
// on first mount, so a page refresh doesn't just dump the user back to login
function SessionRestorer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(restoreSession()).then((action) => {
      // proxy.js can only check that the cookie exists, not that the JWT
      // inside it still works (no signing secret on our side), so a stale
      // or tampered token gets past it and lands here. an empty payload
      // just means there was no cookie at all, which is the normal signed
      // -out state and needs no action. a real payload means /auth/me
      // rejected an actual token, so this finishes the trip back to
      // /login that a hard refresh would've gotten for free from proxy.js
      if (restoreSession.rejected.match(action) && action.payload && pathname !== "/login") {
        router.replace("/login");
      }
    });
  }, [dispatch, router, pathname]);

  return null;
}

export function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <SessionRestorer />
      {children}
    </Provider>
  );
}
