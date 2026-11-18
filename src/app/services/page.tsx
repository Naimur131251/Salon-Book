"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Search, Clock, ArrowUpDown, Scissors, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface IService {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

const categories = [
  "all",
  "Hair",
  "Hair Coloring",
  "Skin Care",
  "Nail Care",
  "Makeup",
  "Spa",
  "Grooming",
];

const API_URL =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:5000";

export function ServicesContent() {
  const [services, setServices] = useState<IService[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") || "all";

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory === "all") params.delete("category");
    else params.set("category", newCategory);
    router.push(
      params.toString() ? `/services?${params.toString()}` : "/services",
      { scroll: false },
    );
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category !== "all") {
          params.set("category", category);
        }

        if (sort) {
          params.set("sort", sort);
        }

        const response = await fetch(
          `${API_URL}/services?${params.toString()}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const result = await response.json();

        setServices(result.data || []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => controller.abort();
  }, [search, category, sort]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-16 md:px-8 mt-7">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#A47754]">
            SalonBook Services
          </p>

          <h1 className="text-3xl font-bold text-[#38291F] md:text-5xl">
            Discover Our Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#806F62] md:text-base">
            Explore our professional salon services and choose the perfect
            treatment for yourself.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 grid gap-4 rounded-2xl border border-[#E9DED2] bg-white p-4 shadow-sm md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18B78]"
            />

            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8DDD1] bg-[#FAF7F2] py-3 pl-11 pr-4 text-sm text-[#38291F] outline-none transition focus:border-[#A47754]"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full rounded-xl border border-[#E8DDD1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#38291F] outline-none focus:border-[#A47754]"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All Categories" : item}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <div className="relative">
            <ArrowUpDown
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18B78]"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#E8DDD1] bg-[#FAF7F2] py-3 pl-11 pr-4 text-sm text-[#38291F] outline-none focus:border-[#A47754]"
            >
              <option value="">Default Sorting</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Service Count */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#38291F]">
            Available Services
          </h2>

          <span className="text-sm text-[#806F62]">
            {services.length} Services Found
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 className="animate-spin text-[#A47754]" size={35} />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && services.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.serviceName}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    width={500}
                    height={500}
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-[#80583D] backdrop-blur">
                    {service.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#38291F]">
                    {service.serviceName}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-[#806F62]">
                    {service.description}
                  </p>

                  <div className="mt-1 flex items-center justify-between border-t border-[#EEE5DC] pt-4">
                    <div>
                      <p className="text-xs text-[#9A8778]">Starting From</p>

                      <p className="mt-1 text-2xl font-bold text-[#80583D]">
                        ৳{service.price.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-[#806F62]">
                      <Clock size={16} />
                      {service.duration} min
                    </div>
                  </div>

                  {/* Details Button */}
                  <Link
                    href={`/services/${service._id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#80583D] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#62432E]"
                  >
                    <Scissors size={16} />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#DCCBBB] bg-white px-6 py-16 text-center">
            <Search className="mx-auto mb-4 text-[#A47754]" size={35} />

            <h3 className="text-xl font-semibold text-[#38291F]">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-[#806F62]">
              Try another search or select a different category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="animate-spin text-[#A47754]" size={35} />
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
