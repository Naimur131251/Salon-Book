"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";

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
    <section className="relative overflow-hidden bg-[#FAF7F2] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCC8B4] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[2px] text-[#A47754]">
              <Sparkles size={15} />
              The Art of Beauty
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-[#38291F] md:text-5xl">
              Featured
              <span className="ml-4 font-serif font-normal italic text-[#A47754]">
                Salon
              </span>{" "}
              Services
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#806F62] md:text-base">
              Experience the perfect blend of luxury, care and expertise.
              Discover treatments designed to bring out your natural beauty.
            </p>
          </div>

          <Link
            href="/services"
            className="group flex w-fit items-center gap-3 rounded-full border border-[#80583D] px-6 py-3.5 text-sm font-semibold text-[#80583D] transition-all duration-300 hover:bg-[#80583D] hover:text-white"
          >
            Explore All Services
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <Loader2 size={35} className="animate-spin text-[#80583D]" />
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center">
            <p className="font-semibold text-[#38291F]">
              No featured services available.
            </p>
            <p className="mt-2 text-sm text-[#806F62]">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, index) => (
              <motion.div
                key={service._id}
                initial={{
                  opacity: 0,
                  y: 80,
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
                  delay: index * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/services/${service._id}`}
                  className="group relative block"
                >
                  <article className="relative isolate overflow-hidden rounded-[28px] border border-[#E9DED2] bg-white shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-[#B99370] hover:shadow-[0_25px_60px_rgba(76,48,29,0.18)]">
                    {/* Image */}
                    <div className="relative h-97.5 overflow-hidden">
                      <Image
                        src={
                          service.image ||
                          service.imageUrl ||
                          "/images/service-placeholder.jpg"
                        }
                        alt={service.serviceName}
                        width={600}
                        height={700}
                        className="h-full w-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:saturate-110"
                      />

                      {/* Animated Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-[#20140E]/95 via-[#20140E]/15 to-black/10 opacity-75 transition-all duration-500 group-hover:opacity-95" />

                      {/* Top Details */}
                      <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                        <span className="rounded-full border border-white/30 bg-white/20 px-4 py-2 text-xs font-semibold tracking-wide text-white backdrop-blur-xl">
                          {service.category}
                        </span>

                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/20 font-serif text-sm text-white backdrop-blur-xl transition-all duration-500 group-hover:rotate-12 group-hover:bg-white group-hover:text-[#80583D]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute right-5 top-24 translate-x-3 rounded-2xl border border-white/30 bg-white/90 px-4 py-3 opacity-0 shadow-xl backdrop-blur-xl transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A18B78]">
                          Treatment Price
                        </p>
                        <p className="mt-1 text-xl font-bold text-[#80583D]">
                          ৳{service.price}
                        </p>
                      </div>

                      {/* Bottom Content */}
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[2px] text-[#E6C7A8]">
                          <span className="h-px w-7 bg-[#E6C7A8]" />
                          Signature Experience
                        </div>

                        <h3 className="text-2xl font-bold leading-tight text-white transition-transform duration-500 group-hover:-translate-y-1 sm:text-3xl">
                          {service.serviceName}
                        </h3>

                        {/* Reveal Description */}
                        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                          <div className="overflow-hidden">
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/80">
                              {service.description}
                            </p>

                            <div className="mt-5 flex items-center justify-between border-t border-white/25 pt-4">
                              <div className="flex items-center gap-2 text-sm text-white/90">
                                <Clock size={16} className="text-[#E6C7A8]" />
                                {service.duration} min
                              </div>

                              <span className="flex items-center gap-2 text-sm font-semibold text-[#E6C7A8]">
                                Discover
                                <ArrowRight
                                  size={17}
                                  className="transition-transform duration-300 group-hover:translate-x-2"
                                />
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Default View */}
                        <div className="mt-5 flex items-center justify-between border-t border-white/30 pt-4 transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-0">
                          <p className="text-xl font-bold text-white">
                            ৳{service.price}
                          </p>

                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Clock size={15} />
                            {service.duration} min
                          </div>
                        </div>
                      </div>

                      {/* Decorative Accent */}
                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#D6B18D] transition-all duration-700 group-hover:w-full" />
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Note */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <span className="h-px w-10 bg-[#DCC8B4]" />
          <p className="text-xs font-medium uppercase tracking-[3px] text-[#A18B78]">
            Beauty is an experience, not just a service
          </p>
          <span className="h-px w-10 bg-[#DCC8B4]" />
        </div>
      </div>
    </section>
  );
}
