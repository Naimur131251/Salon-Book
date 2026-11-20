"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Scissors } from "lucide-react";
import { motion } from "motion/react";

export default function HeroSection() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex min-h-170 cursor-none items-center overflow-hidden bg-[#352A24] md:min-h-187.5"
    >
      {/* Custom Scissors Mouse Follower */}
      <motion.div
        animate={{
          x: cursorPos.x - 20,
          y: cursorPos.y - 20,
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{
          x: { type: "spring", stiffness: 500, damping: 28, mass: 0.5 },
          y: { type: "spring", stiffness: 500, damping: 28, mass: 0.5 },
          opacity: { duration: 0.2 },
          scale: { duration: 0.2 },
        }}
        className="pointer-events-none absolute left-0 top-0 z-50 hidden h-10 w-10 items-center justify-center rounded-full border border-[#D9B98B]/60 bg-[#352A24]/85 text-[#D9B98B] shadow-lg backdrop-blur-sm md:flex"
      >
        <Scissors size={18} />
      </motion.div>

      {/* Background Image with subtle slow zoom */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2000')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-[#211914]/90 via-[#352A24]/70 to-[#352A24]/20" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D9C3A5]/40 bg-white/10 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles size={15} className="text-[#D9B98B]" />
            <span className="text-xs font-medium tracking-[2px] text-[#F5EBDD] sm:text-sm">
              BEAUTY • STYLE • ELEGANCE
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="text-4xl font-semibold leading-[1.2] tracking-tight text-[#F8F3EB] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Discover Your{" "}
            <motion.span
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="mt-2 block font-serif italic font-normal text-[#D9B98B]"
            >
              True Beauty.
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="mt-6 max-w-lg text-sm leading-7 text-[#E8DCCB] sm:text-base sm:leading-8"
          >
            Experience the art of beauty with our expert stylists. From stunning
            hair transformations to relaxing beauty treatments, let us make
            every moment special.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/services"
                className="group inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#B89B7A] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#A78662] sm:w-auto"
              >
                Explore Our Services
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/about"
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-[#F5EBDD]/60 bg-white/5 px-7 py-4 text-sm font-semibold text-[#F8F3EB] backdrop-blur-sm transition hover:bg-white/15 sm:w-auto"
              >
                Discover More
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-6"
          >
            <div>
              <h3 className="text-2xl font-semibold text-[#F8F3EB]">100%</h3>
              <p className="mt-1 text-xs text-[#D9C3A5]">Beauty Care</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <h3 className="text-2xl font-semibold text-[#F8F3EB]">Expert</h3>
              <p className="mt-1 text-xs text-[#D9C3A5]">
                Professional Stylists
              </p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <h3 className="text-2xl font-semibold text-[#F8F3EB]">Premium</h3>
              <p className="mt-1 text-xs text-[#D9C3A5]">Salon Experience</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
