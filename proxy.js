import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("jv_session");
  const token = cookie?.value;

  let payload = null;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
      const { payload: p } = await jwtVerify(token, secret);
      payload = p;
    } catch {
      payload = null;
    }
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/portal")) {
    if (pathname === "/portal/login") return NextResponse.next();
    if (!payload || payload.role !== "user") {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
