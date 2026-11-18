"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  CreditCard,
  XCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

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

  const customerId = session?.user?.id;

  const fetchAppointments = useCallback(async () => {
    if (!customerId) return;

    try {
      const res = await fetch(
        `${API}/customer/appointments?customerId=${encodeURIComponent(customerId)}`,
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

      const res = await fetch(`${API}/customer/appointments/${id}/cancel`, {
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

      // This endpoint will create a Stripe Checkout Session.
      const res = await fetch(`${API}/payments/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      if (!result.url) throw new Error("Checkout URL not found");

      window.location.assign(result.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
      setProcessing("");
    }
  };

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

      <div className="grid gap-5">
        {appointments.length ? (
          appointments.map((item) => (
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
                            className="flex items-center gap-2 rounded-lg bg-[#80583D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#62432E] disabled:opacity-50"
                          >
                            {processing === item._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <CreditCard size={16} />
                            )}
                            Pay Now
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
              No Appointments Yet
            </h3>
            <p className="mt-2 text-sm text-[#806F62]">
              Your salon booking history will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
