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
// import { getToken } from "@/lib/get-token";
import { apiFetch } from "@/lib/api-fetch";
import { motion } from "framer-motion";

// const API = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

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
    href: "/dashboard/customer/appointments",
  },
  {
    key: "pendingAppointments",
    title: "Pending",
    icon: Clock,
    href: "/dashboard/customer/appointments?status=pending",
  },
  {
    key: "confirmedAppointments",
    title: "Confirmed",
    icon: CheckCircle2,
    href: "/dashboard/customer/appointments?status=confirmed",
  },
  {
    key: "cancelledAppointments",
    title: "Cancelled",
    icon: XCircle,
    href: "/dashboard/customer/appointments?status=cancelled",
  },
  {
    key: "paidAppointments",
    title: "Paid Appointments",
    icon: CreditCard,
    href: "/dashboard/customer/appointments?status=paid",
  },
] as const;

export default function CustomerDashboard() {
  const { data: session, isPending } = useSession();

  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      return;
    }

    const fetchOverview = async () => {
      try {
        const res = await apiFetch("/customer/overview", {
          cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }

        setOverview(result.data);

        if (!res.ok) {
          throw new Error(result.message);
        }

        setOverview(result.data);
      } catch (error) {
        console.error("Customer overview error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [session, isPending]);

  if (isPending || (loading && session?.user)) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="animate-spin text-[#80583D]" size={32} />
      </div>
    );
  }

  if (!session?.user) {
    return <p className="p-8">Please sign in to view your dashboard.</p>;
  }

  // অ্যানিমেশন ভেরিয়েন্টস
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  // আপনার কম্পোনেন্টের ভেতরের return অংশ:
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants}>
        <p className="text-sm text-[#A47754]">Customer Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-[#38291F]">
          Welcome, {session.user.name}!
        </h1>
        <p className="mt-2 text-[#806F62]">
          Manage your salon appointments and payments.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.key}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={item.href}
                className="group block rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm transition-colors duration-300 hover:border-[#C8A98E] hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-[#F5EBDD] p-3 text-[#80583D] transition-colors group-hover:bg-[#80583D] group-hover:text-white">
                    <Icon size={23} />
                  </div>
                  <span className="text-3xl font-bold text-[#38291F]">
                    {overview?.[item.key] ?? 0}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="font-medium text-[#806F62]">{item.title}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Appointments Card */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-[#E9DED2] bg-white p-6"
      >
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
            className="group flex items-center gap-2 text-sm font-semibold text-[#80583D] hover:text-[#38291F]"
          >
            View All
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="space-y-4">
          {overview?.recentAppointments?.length ? (
            overview.recentAppointments.map((appointment, index) => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                whileHover={{ scale: 1.01 }}
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
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-10 text-center text-[#806F62]"
            >
              No appointments yet.
              <Link
                href="/services"
                className="ml-2 font-semibold text-[#80583D]"
              >
                Browse Services
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
