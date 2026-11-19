"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Home, Scissors, Sparkles } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [isScissorsOpen, setIsScissorsOpen] = useState(false);

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: "easeOut" as const };

  const particles = [
    { x: "8%", y: "20%", delay: 0 },
    { x: "90%", y: "18%", delay: 0.8 },
    { x: "15%", y: "78%", delay: 1.2 },
    { x: "85%", y: "75%", delay: 0.5 },
    { x: "50%", y: "10%", delay: 1.5 },
    { x: "72%", y: "90%", delay: 0.3 },
    { x: "28%", y: "38%", delay: 1.8 },
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#17130F] px-5 py-16 text-[#F5E9D8]">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-31.25 w-31.25 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8D633B]/10 blur-[120px]" />
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-[#B68B5B]/5 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#8D633B]/10 blur-[120px]" />
      </div>

      {/* Floating particles */}
      {!shouldReduceMotion &&
        particles.map((particle, index) => (
          <motion.div
            key={index}
            className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#D7B98D]/50"
            style={{ left: particle.x, top: particle.y }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 4 + index * 0.4,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Decorative rotating circles */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-155 w-155p -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D7B98D]/6"
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-117.5 w-117.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#D7B98D]/8"
        animate={shouldReduceMotion ? {} : { rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        {/* Top badge */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#C9A779]/20 bg-[#C9A779]/8 px-4 py-2"
        >
          <Sparkles size={14} className="text-[#D7B98D]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#D7B98D]">
            SalonBook · Page Not Found
          </span>
        </motion.div>

        {/* Animated scissors */}
        <motion.button
          type="button"
          aria-label="Animate scissors"
          onClick={() => setIsScissorsOpen((prev) => !prev)}
          whileHover={shouldReduceMotion ? {} : { scale: 1.08, rotate: 5 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
          initial={
            shouldReduceMotion ? false : { opacity: 0, scale: 0.5, rotate: -30 }
          }
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ ...transition, delay: 0.2 }}
          className="group relative mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-[#3B2E22] shadow-[0_0_80px_rgba(201,167,121,0.12)] ring-1 ring-[#D7B98D]/20"
        >
          {/* Outer glow */}
          <motion.div
            className="absolute -inset=2.5 rounded-full border border-[#D7B98D]/20"
            animate={
              shouldReduceMotion
                ? {}
                : { scale: [1, 1.12, 1], opacity: [0.5, 0.1, 0.5] }
            }
            transition={{ duration: 3, repeat: Infinity }}
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="h-24 w-24 overflow-visible"
            fill="none"
          >
            <circle cx="50" cy="50" r="50" fill="#3B2E22" />

            {/* Scissor handles */}
            <g
              stroke="#E0BE8E"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="35" cy="35" r="9" />
              <circle cx="35" cy="65" r="9" />
            </g>

            {/* Animated scissor blades */}
            <motion.g
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      rotate: isScissorsOpen ? [0, -12, 0] : [0, 5, -5, 0],
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: isScissorsOpen ? 0.5 : 2.5,
                      repeat: isScissorsOpen ? 0 : Infinity,
                      ease: "easeInOut",
                    }
              }
              style={{ transformOrigin: "50px 50px" }}
              stroke="#E0BE8E"
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="41.5" y1="58.5" x2="71" y2="29" />
              <line x1="41.5" y1="41.5" x2="50" y2="50" />
              <line x1="56.5" y1="56.5" x2="71" y2="71" />
            </motion.g>
          </svg>

          <motion.div
            className="absolute -right-1 -top-1"
            animate={shouldReduceMotion ? {} : { rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles size={23} className="fill-[#D7B98D] text-[#D7B98D]" />
          </motion.div>
        </motion.button>

        {/* 404 */}
        <div className="mb-3 flex items-center justify-center overflow-hidden">
          {"404".split("").map((digit, index) => (
            <motion.span
              key={index}
              initial={shouldReduceMotion ? false : { y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                ...transition,
                delay: 0.35 + index * 0.12,
              }}
              className="select-none font-serif text-[clamp(100px,22vw,170px)] font-bold leading-none tracking-[-0.08em] text-[#E0BE8E]"
              style={{
                textShadow: "0 10px 60px rgba(224,190,142,0.12)",
              }}
            >
              {digit}
            </motion.span>
          ))}
        </div>

        {/* Heading */}
        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.75 }}
          className="mb-4 text-2xl font-semibold tracking-tight text-[#F5E9D8] sm:text-3xl"
        >
          Oops! This page needs a trim.
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 0.9 }}
          className="mx-auto mb-9 max-w-md text-sm leading-7 text-[#B9A995] sm:text-base"
        >
          Looks like this page has gone missing! It may have been moved, or the
          link might be broken. Let&apos;s get you back to your perfect salon
          experience.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: 1.05 }}
          className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <motion.div
            whileHover={shouldReduceMotion ? {} : { y: -4 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            className="w-full sm:w-auto"
          >
            <Link
              href="/"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#D7B98D] px-7 py-3.5 text-sm font-semibold text-[#251B12] shadow-lg shadow-[#D7B98D]/10 transition-colors hover:bg-[#E9CCA1] sm:w-auto"
            >
              <Home size={17} />
              Back to Home
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => router.back()}
            whileHover={shouldReduceMotion ? {} : { y: -4 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D7B98D]/25 bg-white/3 px-7 py-3.5 text-sm font-medium text-[#E0BE8E] backdrop-blur-md transition-colors hover:border-[#D7B98D]/50 hover:bg-[#D7B98D]/10 sm:w-auto"
          >
            <ArrowLeft size={17} />
            Go Back
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition, delay: 1.3 }}
          className="mt-16 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#806D57]"
        >
          <Scissors size={12} />
          <span>Style your moments with SalonBook</span>
        </motion.div>
      </div>
    </main>
  );
}


// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { motion, useReducedMotion } from "motion/react";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Home,
//   Sparkles,
//   Scissors,
// } from "lucide-react";

// export default function NotFound() {
//   const router = useRouter();
//   const reduceMotion = useReducedMotion();

//   const [cut, setCut] = useState(false);
//   const [hovered, setHovered] = useState(false);

//   const particles = [
//     { left: "8%", top: "18%", delay: 0, duration: 4 },
//     { left: "90%", top: "22%", delay: 0.5, duration: 5 },
//     { left: "15%", top: "75%", delay: 1, duration: 4.5 },
//     { left: "85%", top: "80%", delay: 1.5, duration: 5.5 },
//     { left: "50%", top: "10%", delay: 0.8, duration: 4 },
//     { left: "70%", top: "55%", delay: 1.2, duration: 5 },
//     { left: "30%", top: "45%", delay: 0.3, duration: 4.5 },
//     { left: "95%", top: "50%", delay: 2, duration: 5 },
//   ];

//   return (
//     <main
//       className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#17130F] px-5 py-16 text-[#F5E9D8]"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       {/* Background gradients */}
//       <div className="pointer-events-none absolute inset-0">
//         <motion.div
//           animate={
//             reduceMotion
//               ? {}
//               : {
//                   scale: hovered ? 1.3 : 1,
//                   opacity: hovered ? 0.3 : 0.15,
//                 }
//           }
//           transition={{ duration: 0.8 }}
//           className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A77945] blur-[130px]"
//         />

//         <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#D7B98D]/5 blur-[100px]" />

//         <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#D7B98D]/5 blur-[100px]" />
//       </div>

//       {/* Floating particles */}
//       {!reduceMotion &&
//         particles.map((particle, index) => (
//           <motion.div
//             key={index}
//             className="pointer-events-none absolute z-0 h-1.5 w-1.5 rounded-full bg-[#E0BE8E]"
//             style={{
//               left: particle.left,
//               top: particle.top,
//             }}
//             animate={{
//               y: [0, -35, 0],
//               x: [0, 12, -12, 0],
//               opacity: [0.1, 0.9, 0.2],
//               scale: [0.6, 1.4, 0.6],
//             }}
//             transition={{
//               duration: particle.duration,
//               delay: particle.delay,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//         ))}

//       {/* Rotating outer circle */}
//       <motion.div
//         className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D7B98D]/10"
//         animate={reduceMotion ? {} : { rotate: 360 }}
//         transition={{
//           duration: 60,
//           repeat: Infinity,
//           ease: "linear",
//         }}
//       >
//         <div className="absolute left-1/2 top-0 h-2 w-2 rounded-full bg-[#E0BE8E]/50" />
//       </motion.div>

//       {/* Inner circle */}
//       <motion.div
//         className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#D7B98D]/10"
//         animate={reduceMotion ? {} : { rotate: -360 }}
//         transition={{
//           duration: 80,
//           repeat: Infinity,
//           ease: "linear",
//         }}
//       />

//       {/* Main content */}
//       <motion.section
//         initial={reduceMotion ? false : { opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{
//           duration: 1,
//           ease: "easeOut",
//         }}
//         className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center"
//       >
//         {/* Top badge */}
//         <motion.div
//           initial={reduceMotion ? false : { opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.7 }}
//           className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#D7B98D]/20 bg-[#D7B98D]/10 px-5 py-2.5"
//         >
//           <Sparkles size={14} className="text-[#E0BE8E]" />

//           <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D7B98D]">
//             SalonBook · Page Not Found
//           </span>
//         </motion.div>

//         {/* Scissors animation */}
//         <motion.button
//           type="button"
//           aria-label="Play scissors cutting animation"
//           onClick={() => {
//             setCut(true);
//             setTimeout(() => setCut(false), 650);
//           }}
//           whileHover={reduceMotion ? {} : { scale: 1.1, rotate: 8 }}
//           whileTap={reduceMotion ? {} : { scale: 0.9 }}
//           initial={reduceMotion ? false : { scale: 0, rotate: -45 }}
//           animate={{ scale: 1, rotate: 0 }}
//           transition={{
//             type: "spring",
//             stiffness: 160,
//             damping: 12,
//             delay: 0.3,
//           }}
//           className="group relative mb-10 flex h-36 w-36 items-center justify-center rounded-full bg-[#3B2E22] shadow-[0_0_80px_rgba(224,190,142,0.15)] ring-1 ring-[#D7B98D]/30"
//         >
//           {/* Pulsing ring */}
//           <motion.div
//             className="absolute inset-[-12px] rounded-full border border-[#E0BE8E]/30"
//             animate={
//               reduceMotion
//                 ? {}
//                 : {
//                     scale: [1, 1.2, 1],
//                     opacity: [0.7, 0, 0.7],
//                   }
//             }
//             transition={{
//               duration: 2.5,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />

//           {/* Scissors SVG */}
//           <svg
//             viewBox="0 0 100 100"
//             className="relative h-24 w-24 overflow-visible"
//             fill="none"
//           >
//             {/* Handles */}
//             <g
//               stroke="#E0BE8E"
//               strokeWidth="6.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <circle cx="35" cy="35" r="9" />
//               <circle cx="35" cy="65" r="9" />
//             </g>

//             {/* Upper blade */}
//             <motion.line
//               x1="41.5"
//               y1="41.5"
//               x2="71"
//               y2="29"
//               stroke="#E0BE8E"
//               strokeWidth="6.5"
//               strokeLinecap="round"
//               animate={
//                 reduceMotion
//                   ? {}
//                   : { rotate: cut ? [-18, 20, -18] : [0, -13, 0] }
//               }
//               transition={{
//                 duration: cut ? 0.45 : 1.5,
//                 repeat: cut ? 0 : Infinity,
//                 ease: "easeInOut",
//               }}
//               style={{
//                 transformBox: "view-box",
//                 transformOrigin: "41.5px 41.5px",
//               }}
//             />

//             {/* Lower blade */}
//             <motion.line
//               x1="41.5"
//               y1="58.5"
//               x2="71"
//               y2="71"
//               stroke="#E0BE8E"
//               strokeWidth="6.5"
//               strokeLinecap="round"
//               animate={
//                 reduceMotion
//                   ? {}
//                   : { rotate: cut ? [18, -20, 18] : [0, 13, 0] }
//               }
//               transition={{
//                 duration: cut ? 0.45 : 1.5,
//                 repeat: cut ? 0 : Infinity,
//                 ease: "easeInOut",
//               }}
//               style={{
//                 transformBox: "view-box",
//                 transformOrigin: "41.5px 58.5px",
//               }}
//             />
//           </svg>

//           {/* Sparkle */}
//           <motion.div
//             className="absolute -right-2 -top-2"
//             animate={
//               reduceMotion
//                 ? {}
//                 : {
//                     rotate: [0, 30, -30, 0],
//                     scale: [1, 1.3, 1],
//                   }
//             }
//             transition={{
//               duration: 3,
//               repeat: Infinity,
//             }}
//           >
//             <Sparkles
//               size={25}
//               className="fill-[#E0BE8E] text-[#E0BE8E]"
//             />
//           </motion.div>
//         </motion.button>

//         {/* Animated 404 */}
//         <motion.div
//           animate={
//             reduceMotion
//               ? {}
//               : {
//                   y: [0, -10, 0],
//                 }
//           }
//           transition={{
//             duration: 3,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//           className="mb-4 flex items-center justify-center"
//         >
//           {"404".split("").map((digit, index) => (
//             <motion.span
//               key={index}
//               initial={
//                 reduceMotion
//                   ? false
//                   : { opacity: 0, y: 100, rotateX: -90 }
//               }
//               animate={{ opacity: 1, y: 0, rotateX: 0 }}
//               transition={{
//                 duration: 0.8,
//                 delay: 0.5 + index * 0.15,
//                 type: "spring",
//                 stiffness: 100,
//               }}
//               className="select-none font-serif text-[clamp(105px,23vw,175px)] font-bold leading-none tracking-[-0.08em] text-[#E0BE8E]"
//               style={{
//                 textShadow: "0 10px 60px rgba(224,190,142,0.15)",
//               }}
//             >
//               {digit}
//             </motion.span>
//           ))}
//         </motion.div>

//         {/* Heading */}
//         <motion.h1
//           initial={reduceMotion ? false : { opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8, duration: 0.7 }}
//           className="mb-4 text-2xl font-semibold tracking-tight text-[#F5E9D8] sm:text-3xl"
//         >
//           Oops! This page needs a trim.
//         </motion.h1>

//         {/* Description */}
//         <motion.p
//           initial={reduceMotion ? false : { opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.95, duration: 0.7 }}
//           className="mb-10 max-w-md text-sm leading-7 text-[#B9A995] sm:text-base"
//         >
//           Looks like this page has gone missing! It may have
//           been moved, or the link might be broken. Let&apos;s get
//           you back to your perfect salon experience.
//         </motion.p>

//         {/* Buttons */}
//         <motion.div
//           initial={reduceMotion ? false : { opacity: 0, y: 25 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.1, duration: 0.7 }}
//           className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row"
//         >
//           {/* Home button */}
//           <motion.div
//             whileHover={reduceMotion ? {} : { y: -5, scale: 1.03 }}
//             whileTap={reduceMotion ? {} : { scale: 0.95 }}
//           >
//             <Link
//               href="/"
//               className="group flex items-center justify-center gap-2 rounded-xl bg-[#D7B98D] px-7 py-4 text-sm font-semibold text-[#251B12] shadow-lg shadow-[#D7B98D]/10 transition-colors hover:bg-[#E9CCA1]"
//             >
//               <Home size={17} />

//               Back to Home

//               <ArrowRight
//                 size={16}
//                 className="transition-transform duration-300 group-hover:translate-x-1"
//               />
//             </Link>
//           </motion.div>

//           {/* Go back button */}
//           <motion.button
//             type="button"
//             onClick={() => router.back()}
//             whileHover={reduceMotion ? {} : { y: -5, scale: 1.03 }}
//             whileTap={reduceMotion ? {} : { scale: 0.95 }}
//             className="flex items-center justify-center gap-2 rounded-xl border border-[#D7B98D]/30 bg-white/[0.03] px-7 py-4 text-sm font-medium text-[#E0BE8E] backdrop-blur-md transition-colors hover:border-[#D7B98D]/60 hover:bg-[#D7B98D]/10"
//           >
//             <ArrowLeft size={17} />

//             Go Back
//           </motion.button>
//         </motion.div>

//         {/* Footer */}
//         <motion.div
//           initial={reduceMotion ? false : { opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1.5, duration: 1 }}
//           className="mt-16 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#806D57]"
//         >
//           <Scissors size={13} />
//           Style your moments with SalonBook
//         </motion.div>
//       </motion.section>
//     </main>
//   );
// }
