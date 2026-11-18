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

  // Role-based Dashboard (Default: customer)
  const dashboardLink =
    role?.toLowerCase() === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer";

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
    <header className="sticky top-0 z-50 w-full border-b border-[#E8DCCB]/70 bg-white/90 text-[#352A24] backdrop-blur-md">
      {/* Main Navbar */}
      <nav className="relative mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setProfileOpen(false);
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          className="col-start-1 row-start-1 inline-flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-[#E8DCCB] md:hidden"
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        {/* Logo */}
        <Link
          href="/"
          onClick={() => {
            setIsOpen(false);
            setProfileOpen(false);
          }}
          className="col-start-2 row-start-1 flex items-center justify-center whitespace-nowrap text-xl font-bold tracking-tight md:col-start-1 md:justify-self-start"
        >
          <Scissors size={25} className="mr-2 text-[#B89B7A]" />
          Salon<span className="text-[#B89B7A]">Book</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="col-start-2 row-start-1 hidden items-center justify-center gap-6 md:flex lg:gap-8">
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

        {/* Right Side - Authentication */}
        <div className="col-start-3 row-start-1 flex items-center justify-self-end">
          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-[#E8DCCB]" />
          ) : user ? (
            /* Authenticated User */
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setIsOpen(false);
                }}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-full border border-[#B89B7A]/40 bg-white/50 p-1.5 transition hover:bg-[#E8DCCB]/50 sm:px-3 sm:py-2"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8DCCB] text-[#352A24]">
                    <User size={20} />
                  </div>
                )}

                <span className="hidden max-w-28 truncate text-sm font-semibold text-[#352A24] sm:block">
                  {user.name?.trim().split(" ")[0] || "User"}
                </span>

                <ChevronDown
                  size={16}
                  className={`hidden text-[#765B46] transition sm:block ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-[min(88vw,16rem)] overflow-hidden rounded-2xl border border-[#E8DCCB] bg-[#F8F3EB] p-2 text-[#765B46] shadow-2xl">
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
                    className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-[#E8DCCB]"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-[#E8DCCB]"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Guest Buttons */}
              <div className="hidden items-center gap-3 md:flex">
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
              </div>

              {/* Mobile Guest Avatar */}
              <div className="relative md:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setIsOpen(false);
                  }}
                  aria-label="Open authentication menu"
                  aria-expanded={profileOpen}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B89B7A]/40 bg-white text-[#352A24] transition hover:bg-[#E8DCCB]"
                >
                  <User size={21} />
                </button>

                {/* Guest Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-[min(75vw,16rem)] overflow-hidden rounded-2xl border border-[#E8DCCB] bg-[#F8F3EB] py-2 text-center shadow-2xl">
                    <div className="border-b border-[#E8DCCB] px-4 py-4">
                      <p className="font-semibold text-[#352A24]">
                        Welcome to SalonBook
                      </p>
                      <p className="mt-1 text-xs text-[#765B46]">
                        Sign in or create an account
                      </p>
                    </div>

                    <Link
                      href="/login"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3 text-sm font-medium transition hover:bg-[#E8DCCB]"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setProfileOpen(false)}
                      className="block border-t border-[#E8DCCB] px-4 py-3 text-sm font-medium transition hover:bg-[#E8DCCB]"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-40 border-t border-[#E8DCCB] bg-[#F8F3EB]/95 px-4 py-4 shadow-xl backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-[#765B46] transition hover:bg-[#E8DCCB] hover:text-[#352A24]"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
