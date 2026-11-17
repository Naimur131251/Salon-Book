"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Scissors,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  //   Chrome,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#F8F3EB] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid min-h-162.5 max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        {/* Left Side - Image */}
        <div className="relative hidden min-h-full lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200')",
            }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#211914]/90 via-[#352A24]/30 to-transparent" />

          <Link
            href="/"
            className="absolute left-10 top-10 flex items-center gap-2 text-2xl font-bold text-white"
          >
            <Scissors size={28} className="text-[#D9B98B]" />
            Salon<span className="text-[#D9B98B]">Book</span>
          </Link>

          <div className="absolute bottom-12 left-10 right-10">
            <div className="mb-4 flex items-center gap-2 text-[#D9B98B]">
              <Sparkles size={18} />
              <span className="text-xs font-semibold tracking-[3px]">
                WELCOME BACK TO SALONBOOK
              </span>
            </div>

            <h1 className="font-serif text-4xl font-semibold leading-tight text-white xl:text-5xl">
              Your beauty,
              <span className="block italic text-[#D9B98B]">your moment.</span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#E8DCCB]">
              Sign in to manage your appointments, explore our beauty services,
              and enjoy a personalized salon experience.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center px-5 py-12 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-10 flex items-center gap-2 text-2xl font-bold text-[#352A24] lg:hidden"
            >
              <Scissors size={27} className="text-[#B89B7A]" />
              Salon<span className="text-[#B89B7A]">Book</span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold tracking-[3px] text-[#B89B7A]">
                WELCOME BACK
              </p>

              <h2 className="font-serif text-3xl font-semibold text-[#352A24] sm:text-4xl">
                Sign In
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#8B796A]">
                Enter your credentials to access your SalonBook account.
              </p>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E8DCCB] bg-white py-3.5 text-sm font-semibold text-[#352A24] transition hover:bg-[#F8F3EB]"
            >
              {/* <Chrome size={19} className="text-[#765B46]" /> */}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E8DCCB]" />
              <span className="text-xs text-[#A99989]">
                OR CONTINUE WITH EMAIL
              </span>
              <div className="h-px flex-1 bg-[#E8DCCB]" />
            </div>

            {/* Login Form */}
            <form className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#352A24]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B89B7A]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-[#E8DCCB] bg-[#FDFBF8] py-3.5 pl-11 pr-4 text-sm text-[#352A24] outline-none transition placeholder:text-[#B6A99B] focus:border-[#B89B7A] focus:ring-2 focus:ring-[#B89B7A]/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#352A24]"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#A78662] transition hover:text-[#765B46]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B89B7A]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-[#E8DCCB] bg-[#FDFBF8] py-3.5 pl-11 pr-12 text-sm text-[#352A24] outline-none transition placeholder:text-[#B6A99B] focus:border-[#B89B7A] focus:ring-2 focus:ring-[#B89B7A]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B89B7A]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 accent-[#765B46]"
                />

                <label htmlFor="remember" className="text-xs text-[#8B796A]">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#352A24] py-4 text-sm font-semibold text-white transition hover:bg-[#765B46]"
              >
                Sign In
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-8 text-center text-sm text-[#8B796A]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-[#765B46] transition hover:text-[#B89B7A]"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
