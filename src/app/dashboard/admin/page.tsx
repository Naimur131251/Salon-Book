"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Scissors,
  CalendarDays,
  Clock,
  CheckCircle,
  CreditCard,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { apiFetch } from "@/lib/api-fetch";

interface DashboardStats {
  totalCustomers: number;
  totalActiveServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalSuccessfulPayments: number;
}

const statItems = [
  {
    key: "totalCustomers",
    title: "Registered Customers",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    href: "/dashboard/admin/users",
  },
  {
    key: "totalActiveServices",
    title: "Active Services",
    icon: Scissors,
    color: "bg-purple-50 text-purple-600",
    href: "/dashboard/admin/services",
  },
  {
    key: "totalAppointments",
    title: "Appointment Requests",
    icon: CalendarDays,
    color: "bg-orange-50 text-orange-600",
    href: "/dashboard/admin/appointments",
  },
  {
    key: "pendingAppointments",
    title: "Pending Appointments",
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
    href: "/dashboard/admin/appointments?status=pending",
  },
  {
    key: "confirmedAppointments",
    title: "Confirmed Appointments",
    icon: CheckCircle,
    color: "bg-green-50 text-green-600",
    href: "/dashboard/admin/appointments?status=confirmed",
  },
  {
    key: "totalSuccessfulPayments",
    title: "Successful Payments",
    icon: CreditCard,
    color: "bg-emerald-50 text-emerald-600",
    href: "/dashboard/admin/transactions", // আপনার ট্রানজ্যাকশন পেজের রাউট অনুযায়ী আপডেট করা হয়েছে
  },
] as const;

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiFetch("/admin/overview", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load statistics");
        }

        setStats(result.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#80583D]" size={35} />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl bg-red-50 p-5 text-red-600">
        {error || "Unable to load dashboard"}
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="text-sm font-medium text-[#A47754]">
          SalonBook Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#38291F]">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-sm text-[#806F62]">
          Monitor your salon&apos;s performance and activities.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          const value = stats[item.key] ?? 0;

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={item.href}
                className="block cursor-pointer rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#806F62]">
                      {item.title}
                    </p>
                    <h2 className="mt-4 text-3xl font-bold text-[#38291F]">
                      {item.key === "totalSuccessfulPayments"
                        ? `৳${value.toLocaleString("en-BD")}`
                        : value.toLocaleString("en-BD")}
                    </h2>
                  </div>
                  <div className={`rounded-xl p-4 ${item.color}`}>
                    <Icon size={25} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
