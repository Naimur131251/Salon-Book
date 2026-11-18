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
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

const icons = [Scissors, Palette, Sparkles, Heart, Flower2, Hand, Waves];

interface Service {
  category: string;
}

export default function ServiceCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API}/services`, {
          cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.message);

        const uniqueCategories = [
          ...new Set(
            (result.data as Service[])
              .map((service) => service.category)
              .filter(Boolean),
          ),
        ];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="bg-white px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[3px] text-[#A47754]">
            Explore Our Services
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#38291F] md:text-4xl">
            Browse By Category
          </h2>

          <p className="mt-3 text-[#806F62]">
            Find the perfect beauty treatment for yourself.
          </p>
        </div>

        {loading ? (
          <p className="py-10 text-center text-[#806F62]">
            Loading categories...
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => {
              const Icon = icons[index % icons.length];

              return (
                <Link
                  key={category}
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="group rounded-2xl border border-[#E9DED2] bg-[#FAF7F2] p-6 transition hover:-translate-y-1 hover:bg-[#F3E9DC] hover:shadow-md"
                >
                  <div className="flex justify-between">
                    <div className="rounded-xl bg-white p-3 text-[#80583D] group-hover:bg-[#80583D] group-hover:text-white">
                      <Icon size={26} />
                    </div>

                    <ArrowUpRight size={20} className="text-[#A18B78]" />
                  </div>

                  <h3 className="mt-6 font-bold text-[#38291F]">{category}</h3>

                  <p className="mt-2 text-sm text-[#806F62]">
                    Explore Services
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
