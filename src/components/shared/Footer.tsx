"use client";
import Link from "next/link";
import { Scissors, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
];

const serviceLinks = [
  { name: "Hair Styling", href: "/services" },
  { name: "Hair Coloring", href: "/services" },
  { name: "Skin Care", href: "/services" },
  { name: "Beauty Treatment", href: "/services" },
];

const socialLinks = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaXTwitter, href: "https://x.com", label: "X (Twitter)" },
];

export default function Footer() {
  return (
    <footer className="bg-[#352A24] text-[#F8F3EB]">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-center lg:px-10">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[3px] text-[#B89B7A]">
              STAY CONNECTED
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl">
              Beauty tips & exclusive offers.
            </h2>
            <p className="mt-2 text-sm text-[#D5C5B5]">
              Get the latest updates from SalonBook.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md rounded-full border border-[#B89B7A]/50 bg-white/5 p-1.5"
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#BBAA99]"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 rounded-full bg-[#B89B7A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#A78662]"
            >
              Subscribe
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-12 lg:px-10">
        {/* Brand */}
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <Scissors size={28} className="text-[#B89B7A]" />
            <span className="text-2xl font-bold">
              Salon<span className="text-[#B89B7A]">Book</span>
            </span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-[#D5C5B5]">
            Your beauty, our passion. Discover premium salon services and book
            your perfect beauty experience with ease.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#D5C5B5] transition hover:border-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-[#D5C5B5] transition hover:pl-1 hover:text-[#B89B7A]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-6 text-lg font-semibold">Our Services</h3>
          <ul className="space-y-4">
            {serviceLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-[#D5C5B5] transition hover:pl-1 hover:text-[#B89B7A]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-6 text-lg font-semibold">Contact Us</h3>

          <ul className="space-y-5 text-sm text-[#D5C5B5]">
            <li className="flex items-start gap-3">
              <MapPin size={19} className="shrink-0 text-[#B89B7A]" />
              <span>Rajshahi, Bangladesh</span>
            </li>

            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-[#B89B7A]" />
              <span>+880 1XXX-XXXXXX</span>
            </li>

            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-[#B89B7A]" />
              <span>hello@salonbook.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-center sm:px-8 md:flex-row lg:px-10">
          <p className="text-xs text-[#BBAA99]">
            © 2026 SalonBook. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-[#BBAA99]">
            <Link href="#" className="transition hover:text-[#B89B7A]">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:text-[#B89B7A]">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
