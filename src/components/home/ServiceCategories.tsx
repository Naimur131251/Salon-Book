"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Palette,
  Sparkles,
  Heart,
  Flower2,
  Hand,
  Waves,
  ArrowUpRight,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

const API = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface CategoryItem {
  name: string;
  icon: LucideIcon;
}

const SALON_CATEGORIES: CategoryItem[] = [
  { name: "Haircut & Styling", icon: Scissors },
  { name: "Hair Coloring", icon: Palette },
  { name: "Hair Treatment", icon: Sparkles },
  { name: "Facial & Skincare", icon: Heart },
  { name: "Makeup", icon: Flower2 },
  { name: "Manicure & Pedicure", icon: Hand },
  { name: "Spa & Massage", icon: Waves },
];

interface Service {
  category: string;
}

export default function ServiceCategories() {
  const [serviceCounts, setServiceCounts] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    const fetchServiceCounts = async () => {
      if (!API) return;
      try {
        const res = await fetch(`${API}/services`, {
          cache: "no-store",
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);

        const counts: Record<string, number> = {};
        (result.data as Service[]).forEach((service) => {
          if (service.category) {
            counts[service.category] = (counts[service.category] || 0) + 1;
          }
        });

        setServiceCounts(counts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchServiceCounts();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E4D4C3] bg-white px-5 py-2 text-xs font-bold uppercase tracking-[3px] text-[#A47754]">
            <Sparkles size={15} />
            Discover Your Beauty
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#38291F] sm:text-4xl md:text-5xl">
            Explore By
            <span className="ml-2 font-serif font-normal italic text-[#A47754]">
              Category
            </span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-[#806F62] md:text-base">
            From everyday essentials to luxurious treatments, find the perfect
            experience for your beauty and wellness.
          </p>

          <div className="mt-6 flex items-center gap-2">
            <span className="h-px w-10 bg-[#C8A88A]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#80583D]" />
            <span className="h-px w-10 bg-[#C8A88A]" />
          </div>
        </div>

        {/* 7 Fixed Categories Full-Width Balanced Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-6 lg:grid-cols-12 lg:gap-6">
          {SALON_CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            const count = serviceCounts[category.name];

            // Responsive column spans so all rows fill 100% width cleanly
            const colSpanClass =
              index < 4
                ? "col-span-1 sm:col-span-2 lg:col-span-3"
                : index === 6
                  ? "col-span-2 sm:col-span-2 lg:col-span-4"
                  : "col-span-1 sm:col-span-2 lg:col-span-4";

            return (
              <motion.div
                key={category.name}
                initial={{
                  opacity: 0,
                  y: 70,
                  scale: 0.95,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: false,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.7,
                  delay: (index % 4) * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={colSpanClass}
              >
                <Link
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group relative isolate block h-full min-h-52.5 overflow-hidden rounded-[26px] border border-[#E9DED2] bg-white p-5 transition-all duration-500 hover:-translate-y-2 hover:border-[#B99473] hover:shadow-[0_20px_45px_rgba(83,57,36,0.13)] sm:min-h-57.5 sm:p-7"
                >
                  {/* Decorative Background */}
                  <div className="absolute -right-12 -top-12 -z-10 h-36 w-36 rounded-full bg-[#FAF2E8] transition-all duration-700 group-hover:scale-[2.5] group-hover:bg-[#80583D]" />

                  {/* Large Number */}
                  <span className="absolute right-5 top-5 font-serif text-5xl font-bold text-[#F1E9E0] transition-all duration-500 group-hover:text-white/15 sm:right-7 sm:top-6 sm:text-6xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EEE5] text-[#80583D] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:bg-white group-hover:text-[#80583D] sm:h-16 sm:w-16">
                    <Icon size={27} strokeWidth={1.7} />
                  </div>

                  {/* Category Content */}
                  <div className="relative mt-9">
                    <h3 className="wrap-break-words text-base font-bold leading-snug text-[#38291F] transition-colors duration-300 group-hover:text-[#80583D] sm:text-xl">
                      {category.name}
                    </h3>

                    <div className="mt-3 h-0.5 w-8 bg-[#C8A88A] transition-all duration-500 group-hover:w-16 group-hover:bg-[#E6C7A8]" />

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-[#A18B78] transition-colors duration-300 group-hover:text-[#80583D]/50 sm:text-sm">
                        {count
                          ? `${count} ${count === 1 ? "Service" : "Services"}`
                          : "Explore Collection"}
                      </p>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E9DED2] text-[#80583D] transition-all duration-500 group-hover:translate-x-1 group-hover:border-white/40 group-hover:bg-white group-hover:text-[#80583D]">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#D6B18D] transition-all duration-700 group-hover:w-full" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Link */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#80583D] transition-all hover:gap-4"
          >
            View All Treatments
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
