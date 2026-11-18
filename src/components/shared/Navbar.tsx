"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Scissors,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const router = useRouter();

  // Better Auth Session
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = (user as (typeof user & { role?: string }) | undefined)?.role;

  // Role-based Dashboard
  const dashboardLink = role === "admin" ? "/admin/dashboard" : "/dashboard";

  // Logout
  const handleLogout = async () => {
    try {
      await authClient.signOut();

      setProfileOpen(false);
      setIsOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-2xl font-bold tracking-tight text-[#352A24]"
        >
          <Scissors size={27} className="mr-2 text-[#B89B7A]" />
          Salon<span className="text-[#B89B7A]">Book</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#765B46] transition hover:text-[#B89B7A]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-[#E8DCCB]" />
          ) : user ? (
            /* Authenticated User */
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-[#B89B7A]/40 bg-white/30 px-3 py-2 transition hover:bg-white/60"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8DCCB] text-[#352A24]">
                    <User size={20} />
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-[#352A24]">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-[#765B46] transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-[#E8DCCB] bg-[#F8F3EB] p-2 shadow-xl">
                  <div className="border-b border-[#E8DCCB] px-3 py-3">
                    <p className="truncate text-sm font-semibold text-[#352A24]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#765B46]">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href={dashboardLink}
                    onClick={() => setProfileOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#765B46] transition hover:bg-[#E8DCCB]"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-[#E8DCCB] cursor-pointer"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Public User */
            <>
              <Link
                href="/login"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#352A24] transition hover:bg-[#E8DCCB]"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-[#352A24] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#765B46]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#352A24] hover:bg-[#E8DCCB] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-[#E8DCCB] bg-[#F8F3EB] px-5 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-medium text-[#765B46] transition hover:text-[#B89B7A]"
              >
                {link.name}
              </Link>
            ))}

            {isPending ? (
              <div className="h-10 animate-pulse rounded-lg bg-[#E8DCCB]" />
            ) : user ? (
              <>
                <div className="flex items-center gap-3 border-t border-[#E8DCCB] pt-4">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8DCCB]">
                      <User size={20} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#352A24]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#765B46]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardLink}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 font-medium text-[#765B46]"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 font-medium text-red-600"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 border-t border-[#E8DCCB] pt-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-[#B89B7A] py-2.5 text-center font-semibold text-[#352A24]"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-[#352A24] py-2.5 text-center font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
