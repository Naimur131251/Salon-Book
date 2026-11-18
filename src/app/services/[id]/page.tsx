"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Loader2,
  Scissors,
  //   User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

interface IService {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
}

const API_URL =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:5000";

function ServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const user = session?.user;

  const role = (user as (typeof user & { role?: string }) | undefined)?.role;

  const [service, setService] = useState<IService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");

  // Fetch Service Details
  useEffect(() => {
    const controller = new AbortController();

    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/services/${id}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load service");
        }

        setService(result.data);
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

    if (id) {
      fetchService();
    }

    return () => controller.abort();
  }, [id]);

  // Submit Appointment
  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBookingError("");
    setSuccess("");

    if (!user) {
      router.push("/login");
      return;
    }

    if (role !== "customer") {
      setBookingError("Only customers can book appointments.");
      return;
    }

    if (!service || service.status !== "active") {
      setBookingError("This service is currently unavailable.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          serviceId: service._id,
          appointmentDate,
          timeSlot,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed");
      }

      setSuccess(result.message);
      setAppointmentDate("");
      setTimeSlot("");
      setMessage("");
    } catch (err) {
      setBookingError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (loading || sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <Loader2 size={36} className="animate-spin text-[#80583D]" />
      </div>
    );
  }

  // Error
  if (error || !service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2] px-4 text-center">
        <Scissors size={45} className="mb-5 text-[#A47754]" />

        <h1 className="text-3xl font-bold text-[#38291F]">Service Not Found</h1>

        <p className="mt-3 text-[#806F62]">
          {error || "The requested service does not exist."}
        </p>

        <Link
          href="/services"
          className="mt-6 rounded-xl bg-[#80583D] px-6 py-3 font-semibold text-white hover:bg-[#62432E]"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  const isCustomer = !!user && role === "customer";
  const isAdmin = !!user && role === "admin";
  const isActive = service.status === "active";

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#80583D] hover:text-[#38291F]"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Service Image */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <Image
              src={service.image}
              alt={service.serviceName}
              className="h-full max-h-137.5 min-h-87.5 w-full object-cover"
              width={500}
              height={500}
            />
          </div>

          {/* Service Details */}
          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-[#EDE0D3] px-4 py-2 text-sm font-semibold text-[#80583D]">
              {service.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold text-[#38291F] md:text-4xl">
              {service.serviceName}
            </h1>

            <p className="mt-5 text-base leading-8 text-[#806F62]">
              {service.description}
            </p>

            {/* Price & Duration */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
                <p className="text-sm text-[#9A8778]">Service Price</p>

                <h2 className="mt-2 text-3xl font-bold text-[#80583D]">
                  ৳{service.price.toLocaleString("en-BD")}
                </h2>
              </div>

              <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
                <p className="text-sm text-[#9A8778]">Estimated Duration</p>

                <h2 className="mt-2 flex items-center gap-2 text-2xl font-bold text-[#38291F]">
                  <Clock size={22} />
                  {service.duration} min
                </h2>
              </div>
            </div>

            {/* Booking Section */}
            <div className="mt-8 rounded-2xl border border-[#E9DED2] bg-white p-6">
              <h2 className="text-2xl font-bold text-[#38291F]">
                Book This Service
              </h2>

              <p className="mt-2 text-sm text-[#806F62]">
                Choose your preferred date and time to request an appointment.
              </p>

              {!isActive && (
                <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                  This service is currently inactive and unavailable for
                  booking.
                </div>
              )}

              {isAdmin && (
                <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                  Admin accounts cannot submit customer appointments.
                </div>
              )}

              {!user && (
                <div className="mt-5 rounded-xl bg-[#FAF7F2] p-4">
                  <p className="text-sm text-[#806F62]">
                    Please sign in as a customer to book this service.
                  </p>

                  <Link
                    href="/login"
                    className="mt-4 inline-block rounded-xl bg-[#80583D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#62432E]"
                  >
                    Sign In to Book
                  </Link>
                </div>
              )}

              {user && !isCustomer && !isAdmin && (
                <p className="mt-5 text-sm text-red-600">
                  Your account does not have permission to book appointments.
                </p>
              )}

              {isCustomer && isActive && (
                <form onSubmit={handleBooking} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#38291F]">
                      <CalendarDays className="mr-2 inline" size={17} />
                      Appointment Date
                    </label>

                    <input
                      type="date"
                      required
                      min={new Date().toLocaleDateString("en-CA")}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full rounded-xl border border-[#E8DDD1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#38291F] outline-none focus:border-[#A47754]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#38291F]">
                      <Clock className="mr-2 inline" size={17} />
                      Preferred Time
                    </label>

                    <input
                      type="time"
                      required
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full rounded-xl border border-[#E8DDD1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#38291F] outline-none focus:border-[#A47754]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#38291F]">
                      Additional Message
                    </label>

                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write any special request..."
                      className="w-full resize-none rounded-xl border border-[#E8DDD1] bg-[#FAF7F2] px-4 py-3 text-sm text-[#38291F] outline-none focus:border-[#A47754]"
                    />
                  </div>

                  {bookingError && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {bookingError}
                    </p>
                  )}

                  {success && (
                    <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                      {success}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#80583D] px-5 py-4 font-semibold text-white transition hover:bg-[#62432E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CalendarDays size={18} />
                        Request Appointment
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ServiceDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
          <Loader2 size={36} className="animate-spin text-[#80583D]" />
        </div>
      }
    >
      <ServiceDetailsContent />
    </Suspense>
  );
}
