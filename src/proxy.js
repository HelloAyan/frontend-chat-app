import { NextResponse } from "next/server";
import { TOKEN_COOKIE_NAME } from "@/lib/cookies";

// "/" is the marketing landing page: reachable without a session, same as
// /login, but unlike /login it stays visible even when already signed in —
// a visitor can always pull up the pitch on demand. Only /login itself
// bounces a signed-in visitor straight to /chat.
const PUBLIC_ROUTES = ["/login", "/"];
const LOGIN_ROUTE = "/login";

// this only checks that the session cookie exists, not that the JWT inside
// it is still valid. verifying the signature would need the backend's
// signing secret, which we don't have, so real validation happens client
// side via the /auth/me call in restoreSession, which clears the cookie
// and bounces the user if the token turns out to be dead.
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(TOKEN_COOKIE_NAME)?.value);

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!hasSession && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && pathname === LOGIN_ROUTE) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
