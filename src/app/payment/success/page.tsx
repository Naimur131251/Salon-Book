"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Sparkles,
  CalendarCheck,
  ArrowRight,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const SALON_CONFETTI_COLORS = [
  "#E5C3A6", // Warm Champagne Gold
  "#F4C2C2", // Soft Rose Pink
  "#D9B98B", // Luxury Gold
  "#C89D7C", // Salon Bronze
  "#80583D", // Deep Espresso Gold
  "#FADADD", // Blush Petal
];

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [copied, setCopied] = useState(false);

  // পেজ লোড হওয়ার সাথে সাথেই বাম ও ডান পাশ থেকে একবার ঝুরির মতো কনফেটি ফুটে বের হবে
  useEffect(() => {
    // ১. কনফেটি অ্যানিমেশন
    const fireSideCannons = () => {
      confetti({
        particleCount: 110,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.65 },
        colors: SALON_CONFETTI_COLORS,
        ticks: 260,
        gravity: 0.95,
        scalar: 1.05,
        zIndex: 50,
      });

      confetti({
        particleCount: 110,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.65 },
        colors: SALON_CONFETTI_COLORS,
        ticks: 260,
        gravity: 0.95,
        scalar: 1.05,
        zIndex: 50,
      });
    };

    const timer = setTimeout(fireSideCannons, 150);

    // ২. ব্যাকএন্ডে পেমেন্ট ভেরিফাই করে MongoDB-তে সেভ করা
    if (sessionId) {
      fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            console.error("Payment verification failed:", data.message);
          }
        })
        .catch((err) => console.error("Verify error:", err));
    }

    return () => clearTimeout(timer);
  }, [sessionId]);

  const handleCopyId = async () => {
    if (!sessionId) return;
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      toast.success("Transaction ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy Transaction ID");
    }
  };

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#FAF7F2] px-4 py-16">
      {/* Soft Decorative Glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#E5C3A6]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#F4C2C2]/25 blur-3xl" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 w-full max-w-lg rounded-3xl border border-[#E9DED2] bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md sm:p-10"
      >
        {/* Animated Success Check Icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <motion.span
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.45, opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-emerald-400/35"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              delay: 0.1,
            }}
            className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner ring-4 ring-emerald-500/20"
          >
            <CheckCircle2 className="h-11 w-11 stroke-[2.2]" />
          </motion.div>
        </div>

        {/* Subtitle Badge */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#E9DED2] bg-[#FAF7F2] px-4 py-1.5 text-xs font-semibold uppercase tracking-[2px] text-[#A47754]">
          <Sparkles size={14} />
          Booking Confirmed
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[#38291F] sm:text-4xl">
          Payment Successful!
        </h1>

        {/* Transaction ID + Copy Button */}
        {sessionId && (
          <div className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-3.5 py-2 text-xs text-[#806F62]">
            <span className="shrink-0 font-medium text-[#A47754]">
              Transaction ID:
            </span>
            <span
              title={sessionId}
              className="truncate font-mono font-semibold text-[#38291F]"
            >
              {sessionId.length > 22
                ? `${sessionId.slice(0, 12)}...${sessionId.slice(-8)}`
                : sessionId}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              title="Copy Transaction ID"
              className="ml-1 inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-[#E9DED2] bg-white px-2 py-1 text-[11px] font-semibold text-[#80583D] transition hover:border-[#A47754] hover:bg-[#F3ECE3] active:scale-95"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#806F62] sm:text-base">
          Your payment was submitted successfully. Your transaction is being
          verified and we look forward to pampering you!
        </p>

        {/* Single Primary Action Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard/customer/appointments"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#80583D] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#62432E] hover:shadow-lg"
          >
            <CalendarCheck size={18} />
            View My Appointments
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F2]">
          <Loader2 className="animate-spin text-[#80583D]" size={35} />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
