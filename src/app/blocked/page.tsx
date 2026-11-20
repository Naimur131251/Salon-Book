"use client";

import { ShieldAlert, LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import Link from "next/link";

export default function BlockedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#E9DED2] bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert size={42} />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#38291F]">
          Account Blocked
        </h1>

        <p className="mt-4 leading-7 text-[#806F62]">
          Your account has been temporarily blocked by the administrator. You
          cannot access the platform features at this time.
        </p>

        <p className="mt-3 text-sm text-[#806F62]">
          Please contact the administrator for further assistance.
        </p>

        <div className="flex justify-center items-center">
          <button className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#80583D] px-5 py-3 font-semibold text-white transition hover:bg-[#63432F] cursor-pointer">
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2"
            >
              <Home size={18} />
              Back to Home
            </Link>
          </button>

          <p className="px-5 leading-7 text-[#806F62] mt-6">or</p>
          <button
            onClick={handleLogout}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#80583D] px-5 py-3 font-semibold text-white transition hover:bg-[#63432F] cursor-pointer"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
