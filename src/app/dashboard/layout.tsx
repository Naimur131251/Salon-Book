"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = useSession();

  const user = session?.user;

  const role = (user as (typeof user & { role?: string }) | undefined)?.role;

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role !== "admin" && role !== "customer") {
      router.replace("/");
      return;
    }

    const isAdminRoute = pathname.startsWith("/dashboard/admin");
    const isCustomerRoute = pathname.startsWith("/dashboard/customer");

    if (role === "admin" && isCustomerRoute) {
      router.replace("/dashboard/admin");
    }

    if (role === "customer" && isAdminRoute) {
      router.replace("/dashboard/customer");
    }
  }, [user, role, isPending, pathname, router]);

  const isCorrectRole =
    (role === "admin" && pathname.startsWith("/dashboard/admin")) ||
    (role === "customer" && pathname.startsWith("/dashboard/customer"));

  if (isPending || !user || !isCorrectRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <Loader2 className="animate-spin text-[#80583D]" size={35} />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />

      <main className="min-h-screen w-full bg-[#FAF7F2]">
        <div className="border-b border-[#E9DED2] bg-white px-4 py-3">
          <SidebarTrigger className="text-[#80583D]" />
        </div>

        <div className="p-5 md:p-8">{children}</div>
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
