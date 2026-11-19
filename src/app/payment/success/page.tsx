"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  CalendarCheck,
  ArrowRight,
  Flower2,
} from "lucide-react";

interface Petal {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  sway: number;
  rotation: number;
}

const PETAL_COLORS = [
  "#E5C3A6", // Warm Champagne Gold
  "#F4C2C2", // Soft Rose Pink
  "#D9B98B", // Luxury Gold
  "#FADADD", // Blush Petal
  "#C89D7C", // Salon Bronze
];

// ফুলের পাপড়ি তৈরি করার ফাংশন
const generatePetals = (): Petal[] =>
  Array.from({ length: 38 }).map((_, i) => ({
    id: Date.now() + i,
    left: Math.random() * 100, // 0% থেকে 100% স্ক্রিন জুড়ে
    delay: Math.random() * 2.5, // আলাদা আলাদা সময়ে পড়বে
    duration: 4 + Math.random() * 3.5, // ৪ থেকে ৭.৫ সেকেন্ড ধরে ভাসতে ভাসতে পড়বে
    size: 14 + Math.random() * 14, // ছোট-বড় পাপড়ি
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    sway: (Math.random() - 0.5) * 120, // বাতাসে ডানে-বামে দুলবে
    rotation: Math.random() * 360,
  }));

export default function PaymentSuccessPage() {
  const [petals, setPetals] = useState<Petal[]>(generatePetals);

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#FAF7F2] px-4 py-16">
      {/* Custom Keyframes for Falling & Swaying Flower Petals */}
      <style jsx>{`
        @keyframes petalFall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.95;
          }
          50% {
            transform: translate3d(var(--sway), 45vh, 0) rotate(180deg) scale(1);
          }
          85% {
            opacity: 0.9;
          }
          100% {
            transform: translate3d(calc(var(--sway) * -0.6), 105vh, 0)
              rotate(360deg) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes pulseRing {
          0% {
            transform: scale(0.9);
            opacity: 0.7;
          }
          70% {
            transform: scale(1.35);
            opacity: 0;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-petal {
          animation-name: petalFall;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .animate-pulse-ring {
          animation: pulseRing 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        }

        .animate-card-enter {
          animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Falling Flower Petals Layer */}
      <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
        {petals.map((petal) => (
          <div
            key={petal.id}
            style={
              {
                left: `${petal.left}%`,
                top: "-40px",
                animationDelay: `${petal.delay}s`,
                animationDuration: `${petal.duration}s`,
                "--sway": `${petal.sway}px`,
              } as React.CSSProperties
            }
            className="animate-petal absolute"
          >
            {/* Organic Curved Flower Petal SVG */}
            <svg
              width={petal.size}
              height={petal.size}
              viewBox="0 0 24 24"
              fill={petal.color}
              style={{ transform: `rotate(${petal.rotation}deg)` }}
              className="drop-shadow-sm"
            >
              <path d="M12 2C7.5 6.5 4 11.2 4 15.5C4 19.6 7.6 22 12 22C16.4 22 20 19.6 20 15.5C20 11.2 16.5 6.5 12 2Z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Soft Decorative Glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#E5C3A6]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#F4C2C2]/25 blur-3xl" />

      {/* Main Interactive Card */}
      <div className="animate-card-enter relative z-30 w-full max-w-lg rounded-3xl border border-[#E9DED2] bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md sm:p-10">
        {/* Animated Success Check Icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <span className="animate-pulse-ring absolute inset-0 rounded-full bg-emerald-400/30" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner ring-4 ring-emerald-500/20">
            <CheckCircle2 className="h-11 w-11 stroke-[2.2]" />
          </div>
        </div>

        {/* Subtitle Badge */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F2] px-4 py-1.5 text-xs font-semibold uppercase tracking-[2px] text-[#A47754] border border-[#E9DED2]">
          <Sparkles size={14} />
          Booking Confirmed
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[#38291F] sm:text-4xl">
          Payment Successful!
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#806F62] sm:text-base">
          Your payment was submitted successfully. Your transaction is being
          verified and we look forward to pampering you!
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/appointments"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#80583D] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#62432E] hover:shadow-lg"
          >
            <CalendarCheck size={18} />
            View My Appointments
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          {/* Interactive Button to Trigger More Flower Petals */}
          <button
            type="button"
            onClick={() =>
              setPetals((currentPetals) => [
                ...currentPetals,
                ...generatePetals(),
              ])
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-5 py-3.5 text-sm font-semibold text-[#80583D] transition duration-300 hover:border-[#A47754] hover:bg-[#F3ECE3] active:scale-95"
          >
            <Flower2 size={18} className="text-[#A47754]" />
            Shower Petals
          </button>
        </div>
      </div>
    </main>
  );
}
