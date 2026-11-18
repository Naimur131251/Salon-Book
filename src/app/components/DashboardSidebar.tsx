"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";

import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  Scissors,
  PlusCircle,
  ClipboardList,
  Users,
  CreditCard,
  //   Settings,
  // LogOut,
  //   Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

const adminMenu = [
  {
    id: "overview",
    name: "Overview",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    id: "services",
    name: "Manage Services",
    url: "/dashboard/admin/services",
    icon: Scissors,
  },
  {
    id: "add-service",
    name: "Add / Update Service",
    url: "/dashboard/admin/services/add",
    icon: PlusCircle,
  },
  {
    id: "appointments",
    name: "Manage Appointments",
    url: "/dashboard/admin/appointments",
    icon: ClipboardList,
  },
  {
    id: "users",
    name: "Manage Users",
    url: "/dashboard/admin/users",
    icon: Users,
  },
  {
    id: "transactions",
    name: "Transactions",
    url: "/dashboard/admin/transactions",
    icon: CreditCard,
  },
  {
    id: "profile",
    name: "My Profile",
    url: "/dashboard/admin/profile",
    icon: UserRound,
  },
];

const customerMenu = [
  {
    id: "overview",
    name: "Overview",
    url: "/dashboard/customer",
    icon: LayoutDashboard,
  },
  {
    id: "appointments",
    name: "My Appointments",
    url: "/dashboard/customer/appointments",
    icon: CalendarDays,
  },
  {
    id: "profile",
    name: "My Profile",
    url: "/dashboard/customer/profile",
    icon: UserRound,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const { data: session } = useSession();

  const user = session?.user;

  const role = (user as (typeof user & { role?: string }) | undefined)?.role;

  const menuItems =
    role === "admin" ? adminMenu : role === "customer" ? customerMenu : [];

  const isActive = (url: string) => {
    if (pathname === url) return true;

    // Prevent Overview from staying active on every child route
    if (url === "/dashboard/admin" || url === "/dashboard/customer") {
      return false;
    }

    return pathname.startsWith(`${url}/`);
  };

  return (
    <Sidebar className="border-r border-[#E9DED2] bg-[#FAF7F2]">
      {/* Header */}
      <SidebarHeader className="border-b border-[#E9DED2] px-5 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#80583D] text-white">
            <Scissors size={21} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#38291F]">
              SalonBook
            </h2>

            <p className="text-xs text-[#9A8778]">
              {role === "admin" ? "Admin Dashboard" : "Customer Dashboard"}
            </p>
          </div>
        </Link>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="px-3 py-5">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-[#A18B78]">
            {role === "admin" ? "Administration" : "My Account"}
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={item.name}
                    render={<Link href={item.url} />}
                    className={`h-11 rounded-xl px-3 text-sm font-medium transition ${
                      active
                        ? "bg-[#80583D] text-white hover:bg-[#62432E] hover:text-white"
                        : "text-[#705C4C] hover:bg-[#EDE0D3] hover:text-[#38291F]"
                    }`}
                  >
                    <Icon size={19} />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-[#E9DED2] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white p-3">
          {user?.image ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#E9DED2]">
              <Image
                src={user.image}
                alt={user?.name || "User"}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDE0D3] text-[#80583D]">
              <UserRound size={20} />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#38291F]">
              {user?.name || "User"}
            </p>

            <p className="truncate text-xs text-[#9A8778]">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
