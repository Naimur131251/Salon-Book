"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  XCircle,
  AlertCircle,
  CalendarCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#FAF7F2] px-4 py-16">
      {/* Soft Decorative Glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#E5C3A6]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-red-200/25 blur-3xl" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 w-full max-w-lg rounded-3xl border border-[#E9DED2] bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md sm:p-10"
      >
        {/* Animated Cancel Icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <motion.span
            initial={{ scale: 0.85, opacity: 0.7 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-red-400/25"
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
            className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-inner ring-4 ring-red-500/15"
          >
            <XCircle className="h-11 w-11 stroke-[2.2]" />
          </motion.div>
        </div>

        {/* Subtitle Badge */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-red-200/70 bg-red-50/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[2px] text-red-600">
          <AlertCircle size={14} />
          Payment Cancelled
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-[#38291F] sm:text-4xl">
          Payment Not Completed
        </h1>

        {appointmentId && (
          <p className="mt-3 text-xs font-medium text-[#A47754]">
            Booking Ref:{" "}
            <span className="font-mono text-[#38291F]">
              #{appointmentId.slice(-8).toUpperCase()}
            </span>
          </p>
        )}

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#806F62] sm:text-base">
          Your payment was cancelled and no charges were made to your account.
          Your confirmed appointment is still saved—you can complete the payment
          anytime from your appointments page.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard/customer/appointments"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#80583D] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-[#62432E] hover:shadow-lg"
          >
            <CalendarCheck size={18} />
            Back to My Appointments
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-5 py-3.5 text-sm font-semibold text-[#80583D] transition duration-300 hover:border-[#A47754] hover:bg-[#F3ECE3]"
          >
            <ArrowLeft size={16} />
            Browse Services
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F2]">
          <Loader2 className="animate-spin text-[#80583D]" size={35} />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
