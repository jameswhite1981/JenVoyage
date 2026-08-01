import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// Admin and customer sessions live in separate cookies so the two can
// coexist in the same browser (e.g. Jen testing a customer link she just
// generated must not log her out of /admin) — see lib/session.js.
const COOKIES = { admin: "jv_admin_session", user: "jv_session" };

async function getPayload(request, role) {
  const token = request.cookies.get(COOKIES[role])?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const payload = await getPayload(request, "admin");
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/portal")) {
    if (pathname === "/portal/login" || pathname === "/portal/verify") return NextResponse.next();
    const payload = await getPayload(request, "user");
    if (!payload || payload.role !== "user") {
      return NextResponse.redirect(new URL("/portal/login", request.url));
    }
  }

  // API routes aren't covered by the page-level checks above — enforce the
  // same session requirement here. Only the login/magic-link endpoints stay
  // public (there's no session yet when calling them).
  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    const payload = await getPayload(request, "admin");
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
  }

  if (pathname.startsWith("/api/portal") && pathname !== "/api/portal/magic-link") {
    const payload = await getPayload(request, "user");
    if (!payload || payload.role !== "user") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/api/admin/:path*", "/api/portal/:path*"],
};
