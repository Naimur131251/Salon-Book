"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  imageUrl?: string;
  status: string;
}

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const res = await fetch(`${API}/services?featured=true`, {
          cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }

        setServices(result.data || []);
      } catch (error) {
        console.error("Featured services error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  return (
    <section className="bg-[#FAF7F2] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[3px] text-[#A47754]">
              <Sparkles size={17} />
              Our Special Treatments
            </div>

            <h2 className="text-3xl font-bold text-[#38291F] md:text-4xl">
              Featured Salon Services
            </h2>

            <p className="mt-3 max-w-xl leading-7 text-[#806F62]">
              Discover our handpicked beauty treatments and give yourself the
              care you deserve.
            </p>
          </div>

          <Link
            href="/services"
            className="flex items-center gap-2 font-semibold text-[#80583D] transition hover:text-[#38291F]"
          >
            View All Services
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 size={35} className="animate-spin text-[#80583D]" />
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-[#E9DED2] bg-white p-12 text-center">
            <p className="font-medium text-[#38291F]">
              No featured services available.
            </p>
            <p className="mt-2 text-sm text-[#806F62]">
              Please check back later.
            </p>
          </div>
        ) : (
          /* Service Cards */
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <div
                key={service._id}
                className="group overflow-hidden rounded-2xl border border-[#E9DED2] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={
                      service.image ||
                      service.imageUrl ||
                      "/images/service-placeholder.jpg"
                    }
                    alt={service.serviceName}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    width={500}
                    height={500}
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#80583D] shadow-sm">
                    {service.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#38291F] transition group-hover:text-[#80583D]">
                    {service.serviceName}
                  </h3>

                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-[#806F62]">
                    {service.description}
                  </p>

                  {/* Price & Duration */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#E9DED2] pt-5">
                    <div>
                      <p className="text-xs text-[#A18B78]">Service Price</p>
                      <p className="mt-1 text-xl font-bold text-[#80583D]">
                        ৳{service.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#806F62]">
                      <Clock size={17} className="text-[#A47754]" />
                      {service.duration} min
                    </div>
                  </div>

                  {/* Details Button */}
                  <Link
                    href={`/services/${service._id}`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#80583D] py-3 font-semibold text-white transition hover:bg-[#62432E]"
                  >
                    View Details
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
