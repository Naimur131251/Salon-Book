import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // 1. Blocked users cannot access service details
  const isServiceDetails =
    pathname.startsWith("/services/") && pathname !== "/services/";

  if (isServiceDetails && session?.user) {
    const user = session.user as typeof session.user & {
      isBlocked?: boolean;
    };

    if (user.isBlocked === true) {
      return NextResponse.redirect(new URL("/blocked", request.url));
    }
  }

  // 2. Dashboard authentication protection
  if (pathname.startsWith("/dashboard")) {
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set(
        "callbackUrl",
        pathname + request.nextUrl.search,
      );

      return NextResponse.redirect(loginUrl);
    }

    const user = session.user as typeof session.user & {
      role?: string;
      isBlocked?: boolean;
    };

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
  matcher: ["/dashboard/:path*", "/services/:path*"],
};
