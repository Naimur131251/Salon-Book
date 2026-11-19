"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Clock,
  CreditCard,
  XCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api-fetch";
// import Link from "next/link";

// const API = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface Appointment {
  _id: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
  paymentStatus: string;
  servicePrice: number;
  service?: {
    serviceName: string;
    image: string;
    category: string;
  };
}

export default function MyAppointmentsPage() {
  const { data: session, isPending } = useSession();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFilter = searchParams.get("status") || "all";

  const [sortBy, setSortBy] = useState("newest");

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const customerId = session?.user?.id;

  const fetchAppointments = useCallback(async () => {
    if (!customerId) return;

    try {
      const res = await apiFetch(
        `/customer/appointments?customerId=${encodeURIComponent(customerId)}`,
        { cache: "no-store" },
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setAppointments(result.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (isPending) return;

    if (!customerId) return;

    void Promise.resolve().then(fetchAppointments);
  }, [customerId, isPending, fetchAppointments]);

  const handleCancel = async (id: string) => {
    if (!customerId) return;

    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setProcessing(id);

      const res = await apiFetch(`/customer/appointments/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success(result.message);
      await fetchAppointments();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Cancellation failed",
      );
    } finally {
      setProcessing("");
    }
  };

  const handlePayment = async (id: string) => {
    try {
      setProcessing(id);

      const res = await apiFetch("/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({
          appointmentId: id,
        }),
      });

      const result = await res.json();
      console.log(result);
      

      if (!res.ok) {
        throw new Error(result.message || "Payment failed");
      }

      if (!result.url) {
        throw new Error("Stripe checkout URL not found");
      }

      // Redirect to Stripe Checkout
      window.location.href = result.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");

      setProcessing("");
    }
  };

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    // Filtering
    if (activeFilter === "paid") {
      result = result.filter((item) => item.paymentStatus === "paid");
    } else if (activeFilter !== "all") {
      result = result.filter((item) => item.status === activeFilter);
    }

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.appointmentDate).getTime();
      const dateB = new Date(b.appointmentDate).getTime();

      switch (sortBy) {
        case "oldest":
          return dateA - dateB;

        case "newest":
          return dateB - dateA;

        case "date-asc":
          return dateA - dateB;

        case "date-desc":
          return dateB - dateA;

        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [appointments, activeFilter, sortBy]);

  if (isPending || (loading && customerId)) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="animate-spin text-[#80583D]" size={32} />
      </div>
    );
  }

  if (!session?.user) {
    return <p className="p-8">Please sign in first.</p>;
  }

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-3xl font-bold text-[#38291F]">My Appointments</h1>
        <p className="mt-2 text-[#806F62]">
          View and manage your salon bookings.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl border border-[#E9DED2] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter */}
        <div className="w-full sm:w-56">
          <label className="mb-2 block text-sm font-semibold text-[#38291F]">
            Filter Appointments
          </label>

          <select
            value={activeFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-full rounded-lg border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 text-sm text-[#38291F] outline-none focus:border-[#80583D]"
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="paid">Paid Appointments</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="w-full sm:w-56">
          <label className="mb-2 block text-sm font-semibold text-[#38291F]">
            Sort By
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-lg border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 text-sm text-[#38291F] outline-none focus:border-[#80583D]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="date-asc">Appointment Date: Earliest</option>
            <option value="date-desc">Appointment Date: Latest</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5">
        {filteredAppointments.length ? (
          filteredAppointments.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row">
                {item.service?.image && (
                  <Image
                    src={item.service.image}
                    alt={item.service.serviceName}
                    className="h-36 w-full rounded-xl object-cover sm:w-40"
                    width={500}
                    height={500}
                  />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-[#38291F]">
                        {item.service?.serviceName || "Salon Service"}
                      </h2>
                      <p className="mt-1 text-sm text-[#806F62]">
                        {item.service?.category}
                      </p>
                    </div>

                    <span className="h-fit rounded-full bg-[#F5EBDD] px-3 py-1 text-xs font-semibold capitalize text-[#80583D]">
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#806F62]">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {item.appointmentDate}
                    </span>

                    <span className="flex items-center gap-2">
                      <Clock size={16} />
                      {item.timeSlot}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#38291F]">
                        ৳{item.servicePrice}
                      </p>
                      <p className="text-xs capitalize text-[#806F62]">
                        Payment: {item.paymentStatus}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.status === "pending" && (
                        <button
                          disabled={processing === item._id}
                          onClick={() => handleCancel(item._id)}
                          className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      )}

                      {item.status === "confirmed" &&
                        item.paymentStatus === "unpaid" && (
                          <button
                            disabled={processing === item._id}
                            onClick={() => handlePayment(item._id)}
                            className="flex items-center gap-2 rounded-lg bg-[#80583D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#62432E] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {processing === item._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <CreditCard size={16} />
                            )}

                            {processing === item._id
                              ? "Processing..."
                              : "Pay Now"}
                          </button>
                        )}

                      {item.paymentStatus === "paid" && (
                        <span className="rounded-lg bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                          Paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-[#E9DED2] bg-white py-16 text-center">
            <CalendarDays className="mx-auto text-[#A47754]" size={40} />

            <h3 className="mt-4 text-xl font-bold text-[#38291F]">
              {activeFilter === "all"
                ? "No Appointments Yet"
                : "No Matching Appointments"}
            </h3>

            <p className="mt-2 text-sm text-[#806F62]">
              {activeFilter === "all"
                ? "Your salon booking history will appear here."
                : `No ${activeFilter} appointments found.`}
            </p>

            {activeFilter !== "all" && (
              <button
                onClick={() => handleFilterChange("all")}
                className="mt-5 rounded-lg bg-[#80583D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#62432E]"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
