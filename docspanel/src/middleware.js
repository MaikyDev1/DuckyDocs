// src/middleware.js

import { NextResponse } from "next/server";

const PRODUCTION_DOMAIN = "duckydocs.com";

const VALIDATE_REGEX = /^[a-z0-9-]+$/;

export function middleware(request) {
  const hostname = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";

  const host = hostname.split(":")[0].toLowerCase();


  let project = null;

  if (host.endsWith(".localhost")) {
    project = host.slice(0, -".localhost".length);
  } else if (host.endsWith(`.${PRODUCTION_DOMAIN}`)) {
    project = host.slice(0, -`.${PRODUCTION_DOMAIN}`.length);
  }

  if (!project || project === "www" || !VALIDATE_REGEX.test(project.toLowerCase())) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/internal")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  url.pathname = `/internal/${project}${url.pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};