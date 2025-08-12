import { NextResponse } from "next/server";

export const config = {
  // Protegge tutto tranne statici/next internI e favicon
  matcher: ["/((?!_next/|favicon.ico|robots.txt|sitemap.xml).*)"]
};

export function middleware(req) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  if (basicAuth) {
    const [scheme, encoded] = basicAuth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString();
      const [u, p] = decoded.split(":");
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Auth required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected"'
    }
  });
}

