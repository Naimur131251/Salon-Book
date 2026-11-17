"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Scissors } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-2xl font-bold tracking-tight text-[#352A24]"
        >
          <Scissors size={27} className="text-[#B89B7A] mr-2" />
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

        {/* Desktop Buttons */}
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
            Get Started
          </Link>
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
        <div className="border-t border-[#E8DCCB] bg-[#F8F3EB] px-5 py-5 md:hidden">
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

            <div className="mt-2 flex flex-col gap-3">
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
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
