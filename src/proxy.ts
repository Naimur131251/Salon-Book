import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // ১. লগইন করা না থাকলে login পেজে পাঠাবে
  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (session.user as { role?: string }).role;
  const pathname = request.nextUrl.pathname;

  // ২. কাস্টমার যেন admin ড্যাশবোর্ডে ঢুকতে না পারে
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  // ৩. অ্যাডমিন যেন customer ড্যাশবোর্ডে ঢুকতে না পারে (ঐচ্ছিক)
  if (pathname.startsWith("/dashboard/customer") && role !== "customer") {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/services/:path+", "/dashboard/:path*"],
};

