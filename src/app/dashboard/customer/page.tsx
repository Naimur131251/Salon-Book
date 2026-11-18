"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  ArrowRight,
  Loader2,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface RecentAppointment {
  _id: string;
  serviceName?: string;
  appointmentDate: string;
  timeSlot: string;
  status: string;
}

interface Overview {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  paidAppointments: number;
  recentAppointments: RecentAppointment[];
}

const stats = [
  {
    key: "totalAppointments",
    title: "Total Appointments",
    icon: CalendarDays,
  },
  {
    key: "pendingAppointments",
    title: "Pending",
    icon: Clock,
  },
  {
    key: "confirmedAppointments",
    title: "Confirmed",
    icon: CheckCircle2,
  },
  {
    key: "cancelledAppointments",
    title: "Cancelled",
    icon: XCircle,
  },
  {
    key: "paidAppointments",
    title: "Paid Appointments",
    icon: CreditCard,
  },
] as const;

export default function CustomerDashboard() {
  const { data: session, isPending } = useSession();

  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customerId = session?.user?.id;

    if (!customerId) {
      return;
    }

    const fetchOverview = async () => {
      try {
        const res = await fetch(
          `${API}/customer/overview?customerId=${encodeURIComponent(customerId)}`,
          { cache: "no-store" },
        );

        const result = await res.json();

        if (!res.ok) throw new Error(result.message);

        setOverview(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [session, isPending]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="animate-spin text-[#80583D]" size={32} />
      </div>
    );
  }

  if (!session?.user) {
    return <p className="p-8">Please sign in to view your dashboard.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-[#A47754]">Customer Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-[#38291F]">
          Welcome, {session.user.name}!
        </h1>
        <p className="mt-2 text-[#806F62]">
          Manage your salon appointments and payments.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-[#F5EBDD] p-3 text-[#80583D]">
                  <Icon size={23} />
                </div>
                <span className="text-3xl font-bold text-[#38291F]">
                  {overview?.[item.key] ?? 0}
                </span>
              </div>
              <p className="mt-5 font-medium text-[#806F62]">{item.title}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#E9DED2] bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#38291F]">
              Recent Appointments
            </h2>
            <p className="mt-1 text-sm text-[#806F62]">
              Your latest booking requests
            </p>
          </div>

          <Link
            href="/dashboard/customer/appointments"
            className="flex items-center gap-2 text-sm font-semibold text-[#80583D] hover:text-[#38291F]"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="space-y-4">
          {overview?.recentAppointments?.length ? (
            overview.recentAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FAF7F2] p-4"
              >
                <div>
                  <p className="font-semibold text-[#38291F]">
                    {appointment.serviceName || "Salon Service"}
                  </p>
                  <p className="mt-1 text-sm text-[#806F62]">
                    {appointment.appointmentDate} · {appointment.timeSlot}
                  </p>
                </div>

                <span className="rounded-full bg-[#EDE0D3] px-3 py-1 text-xs font-semibold capitalize text-[#80583D]">
                  {appointment.status}
                </span>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-[#806F62]">
              No appointments yet.
              <Link
                href="/services"
                className="ml-2 font-semibold text-[#80583D]"
              >
                Browse Services
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
