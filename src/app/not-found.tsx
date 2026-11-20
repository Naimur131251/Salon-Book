"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Home, Sparkles, Scissors } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [cut, setCut] = useState(false);
  const [hovered, setHovered] = useState(false);

  const particles = [
    { left: "8%", top: "18%", delay: 0, duration: 4 },
    { left: "90%", top: "22%", delay: 0.5, duration: 5 },
    { left: "15%", top: "75%", delay: 1, duration: 4.5 },
    { left: "85%", top: "80%", delay: 1.5, duration: 5.5 },
    { left: "50%", top: "10%", delay: 0.8, duration: 4 },
    { left: "70%", top: "55%", delay: 1.2, duration: 5 },
    { left: "30%", top: "45%", delay: 0.3, duration: 4.5 },
    { left: "95%", top: "50%", delay: 2, duration: 5 },
  ];

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#17130F] px-5 py-16 text-[#F5E9D8]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  scale: hovered ? 1.3 : 1,
                  opacity: hovered ? 0.3 : 0.15,
                }
          }
          transition={{ duration: 0.8 }}
          className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A77945] blur-[130px]"
        />

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#D7B98D]/5 blur-[100px]" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#D7B98D]/5 blur-[100px]" />
      </div>

      {/* Floating particles */}
      {!reduceMotion &&
        particles.map((particle, index) => (
          <motion.div
            key={index}
            className="pointer-events-none absolute z-0 h-1.5 w-1.5 rounded-full bg-[#E0BE8E]"
            style={{
              left: particle.left,
              top: particle.top,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, 12, -12, 0],
              opacity: [0.1, 0.9, 0.2],
              scale: [0.6, 1.4, 0.6],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Rotating outer circle */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-162.5 w-162.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D7B98D]/10"
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute left-1/2 top-0 h-2 w-2 rounded-full bg-[#E0BE8E]/50" />
      </motion.div>

      {/* Inner circle */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-120 w-120 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#D7B98D]/10"
        animate={reduceMotion ? {} : { rotate: -360 }}
        transition={{
          duration: 80,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main content */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center"
      >
        {/* Top badge */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#D7B98D]/20 bg-[#D7B98D]/10 px-5 py-2.5"
        >
          <Sparkles size={14} className="text-[#E0BE8E]" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D7B98D]">
            SalonBook · Page Not Found
          </span>
        </motion.div>

        {/* Scissors animation */}
        <motion.button
          type="button"
          aria-label="Play scissors cutting animation"
          onClick={() => {
            setCut(true);
            setTimeout(() => setCut(false), 650);
          }}
          whileHover={reduceMotion ? {} : { scale: 1.1, rotate: 8 }}
          whileTap={reduceMotion ? {} : { scale: 0.9 }}
          initial={reduceMotion ? false : { scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 12,
            delay: 0.3,
          }}
          className="group relative mb-10 flex h-36 w-36 items-center justify-center rounded-full bg-[#3B2E22] shadow-[0_0_80px_rgba(224,190,142,0.15)] ring-1 ring-[#D7B98D]/30"
        >
          {/* Pulsing ring */}
          <motion.div
            className="absolute -inset-3 rounded-full border border-[#E0BE8E]/30"
            animate={
              reduceMotion
                ? {}
                : {
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0, 0.7],
                  }
            }
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Scissors SVG */}
          <svg
            viewBox="0 0 100 100"
            className="relative h-24 w-24 overflow-visible"
            fill="none"
          >
            {/* Upper Handle + Blade (Pivots cleanly at 50, 50) */}
            <motion.g
              animate={
                reduceMotion
                  ? {}
                  : { rotate: cut ? [-14, 16, -14] : [0, -10, 0] }
              }
              transition={{
                duration: cut ? 0.45 : 1.5,
                repeat: cut ? 0 : Infinity,
                ease: "easeInOut",
              }}
              style={{
                transformBox: "view-box",
                transformOrigin: "50px 50px",
              }}
            >
              <circle
                cx="32"
                cy="32"
                r="9"
                stroke="#E0BE8E"
                strokeWidth="6.5"
              />
              <line
                x1="38.5"
                y1="38.5"
                x2="74"
                y2="74"
                stroke="#E0BE8E"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Lower Handle + Blade (Pivots cleanly at 50, 50) */}
            <motion.g
              animate={
                reduceMotion ? {} : { rotate: cut ? [14, -16, 14] : [0, 10, 0] }
              }
              transition={{
                duration: cut ? 0.45 : 1.5,
                repeat: cut ? 0 : Infinity,
                ease: "easeInOut",
              }}
              style={{
                transformBox: "view-box",
                transformOrigin: "50px 50px",
              }}
            >
              <circle
                cx="32"
                cy="68"
                r="9"
                stroke="#E0BE8E"
                strokeWidth="6.5"
              />
              <line
                x1="38.5"
                y1="61.5"
                x2="74"
                y2="26"
                stroke="#E0BE8E"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Center Pivot Screw */}
            <circle cx="50" cy="50" r="3.5" fill="#E0BE8E" />
          </svg>

          {/* Sparkle */}
          <motion.div
            className="absolute -right-2 -top-2"
            animate={
              reduceMotion
                ? {}
                : {
                    rotate: [0, 30, -30, 0],
                    scale: [1, 1.3, 1],
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <Sparkles size={25} className="fill-[#E0BE8E] text-[#E0BE8E]" />
          </motion.div>
        </motion.button>

        {/* Animated 404 */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  y: [0, -10, 0],
                }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-4 flex items-center justify-center"
        >
          {"404".split("").map((digit, index) => (
            <motion.span
              key={index}
              initial={
                reduceMotion ? false : { opacity: 0, y: 100, rotateX: -90 }
              }
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.5 + index * 0.15,
                type: "spring",
                stiffness: 100,
              }}
              className="select-none font-serif text-[clamp(105px,23vw,175px)] font-bold leading-none tracking-[-0.08em] text-[#E0BE8E]"
              style={{
                textShadow: "0 10px 60px rgba(224,190,142,0.15)",
              }}
            >
              {digit}
            </motion.span>
          ))}
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mb-4 text-2xl font-semibold tracking-tight text-[#F5E9D8] sm:text-3xl"
        >
          Oops! This page needs a trim.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.7 }}
          className="mb-10 max-w-md text-sm leading-7 text-[#B9A995] sm:text-base"
        >
          Looks like this page has gone missing! It may have been moved, or the
          link might be broken. Let&apos;s get you back to your perfect salon
          experience.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row"
        >
          {/* Go back button */}
          <motion.button
            type="button"
            onClick={() => router.back()}
            whileHover={reduceMotion ? {} : { y: -5, scale: 1.03 }}
            whileTap={reduceMotion ? {} : { scale: 0.95 }}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#D7B98D]/30 bg-white/3 px-7 py-4 text-sm font-medium text-[#E0BE8E] backdrop-blur-md transition-colors hover:border-[#D7B98D]/60 hover:bg-[#D7B98D]/10"
          >
            <ArrowLeft size={17} />
            Go Back
          </motion.button>
          {/* Home button */}
          <motion.div
            whileHover={reduceMotion ? {} : { y: -5, scale: 1.03 }}
            whileTap={reduceMotion ? {} : { scale: 0.95 }}
          >
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 rounded-xl bg-[#D7B98D] px-7 py-4 text-sm font-semibold text-[#251B12] shadow-lg shadow-[#D7B98D]/10 transition-colors hover:bg-[#E9CCA1]"
            >
              <Home size={17} />
              Back to Home
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#806D57]"
        >
          <Scissors size={13} />
          Style your moments with SalonBook
        </motion.div>
      </motion.section>
    </main>
  );
}
