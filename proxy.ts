import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth";

export function proxy(request: NextRequest) {
  const isAuthenticated = verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/hadmin/login", request.url));
  }
}

export const config = {
  matcher: ["/hadmin"],
};
