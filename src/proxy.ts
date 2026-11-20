import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isServiceDetails =
    pathname.startsWith("/services/") && pathname !== "/services/";
  const isDashboard = pathname.startsWith("/dashboard");

  // শুধুমাত্র প্রয়োজনীয় রাউটেই সেশন চেক করবে
  if (!isServiceDetails && !isDashboard) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user as
    | (NonNullable<typeof session>["user"] & {
        role?: string;
        isBlocked?: boolean;
      })
    | undefined;

  // 1. Service details protection (Login & Blocked check)
  if (isServiceDetails) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    if (user.isBlocked === true) {
      return NextResponse.redirect(new URL("/blocked", request.url));
    }
  }

  // 2. Dashboard authentication protection
  if (isDashboard) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Blocked user protection
    if (user.isBlocked === true) {
      return NextResponse.redirect(new URL("/blocked", request.url));
    }

    // 4. Admin protection
    if (pathname.startsWith("/dashboard/admin") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // 5. Customer protection
    if (
      pathname.startsWith("/dashboard/customer") &&
      user.role !== "customer"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // 6. Dashboard root
    if (pathname === "/dashboard") {
      return NextResponse.redirect(
        new URL(
          user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer",
          request.url,
        ),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/services/:path+"],
};
