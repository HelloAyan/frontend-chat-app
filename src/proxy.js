import { NextResponse } from "next/server";
import { TOKEN_COOKIE_NAME } from "@/lib/cookies";

const PUBLIC_ROUTES = ["/login"];

// this only checks that the session cookie exists, not that the JWT inside
// it is still valid. verifying the signature would need the backend's
// signing secret, which we don't have, so real validation happens client
// side via the /auth/me call in restoreSession, which clears the cookie
// and bounces the user if the token turns out to be dead.
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(TOKEN_COOKIE_NAME)?.value);

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasSession ? "/chat" : "/login", request.url));
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!hasSession && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isPublicRoute) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
