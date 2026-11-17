import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-170 items-center overflow-hidden bg-[#352A24] md:min-h-187.5 mt-20">
        
      {/* Background Image */}
      <div
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D9C3A5]/40 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles size={15} className="text-[#D9B98B]" />
            <span className="text-xs font-medium tracking-[2px] text-[#F5EBDD] sm:text-sm">
              BEAUTY • STYLE • ELEGANCE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-semibold leading-[1.2] tracking-tight text-[#F8F3EB] sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Your
            <span className="mt-2 block font-serif italic font-normal text-[#D9B98B]">
              True Beauty.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-lg text-sm leading-7 text-[#E8DCCB] sm:text-base sm:leading-8">
            Experience the art of beauty with our expert stylists. From stunning
            hair transformations to relaxing beauty treatments, let us make
            every moment special.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#B89B7A] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#A78662]"
            >
              Explore Our Services
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-[#F5EBDD]/60 bg-white/5 px-7 py-4 text-sm font-semibold text-[#F8F3EB] backdrop-blur-sm transition hover:bg-white/15"
            >
              Discover More
            </Link>
          </div>

          {/* Bottom Text */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-6">
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
          </div>
        </div>
      </div>
    </section>
  );
}
