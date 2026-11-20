"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  CreditCard,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Check,
  Copy,
} from "lucide-react";
import { motion } from "motion/react";
import { apiFetch } from "@/lib/api-fetch";

interface ITransaction {
  _id: string;
  appointmentId: string;
  customerId?: {
    name?: string;
    email?: string;
  };
  service?: {
    serviceName?: string;
    image?: string;
  };
  appointmentDate: string;
  amount: number;
  currency?: string;
  stripeSessionId?: string;
  status: "paid" | "failed";
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyReference = async (sessionId: string) => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopiedId(sessionId);
      toast.success("Stripe Reference copied!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy reference");
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/admin/transactions", {
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to load data");

      setTransactions(result.data || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch transactions",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchTransactions);
  }, []);

  const filtered = transactions.filter((item) =>
    `${item.customerId?.name || ""} ${item.customerId?.email || ""} ${item.service?.serviceName || ""} ${item.stripeSessionId || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const paid = transactions.filter((t) => t.status === "paid" || "succeeded");
  const failed = transactions.filter((t) => t.status === "failed");

  const totalRevenue = paid.reduce(
    (total, item) => total + (item.amount || 0),
    0,
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="text-sm font-medium text-[#A47754]">
          Financial Management
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#38291F]">Transactions</h1>
        <p className="mt-2 text-sm text-[#806F62]">
          Monitor Stripe payment transactions.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="rounded-2xl border border-[#E9DED2] bg-white p-5 transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-[#806F62]">Total Transactions</p>
          <h2 className="mt-2 text-2xl font-bold text-[#38291F]">
            {transactions.length}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="rounded-2xl border border-[#E9DED2] bg-white p-5 transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-[#806F62]">Successful Payments</p>
          <h2 className="mt-2 text-2xl font-bold text-green-700">
            {paid.length}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="rounded-2xl border border-[#E9DED2] bg-white p-5 transition-shadow hover:shadow-md"
        >
          <p className="text-sm text-[#806F62]">Total Revenue</p>
          <h2 className="mt-2 text-2xl font-bold text-[#80583D]">
            ৳{totalRevenue.toLocaleString("en-BD")}
          </h2>
          <p className="mt-1 text-xs text-[#806F62]">
            {failed.length} failed transactions excluded
          </p>
        </motion.div>
      </div>
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
        className="relative"
      >
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18B78]"
          size={19}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer, service, or Stripe session..."
          className="w-full rounded-xl border border-[#E9DED2] bg-white py-3 pl-11 pr-4 text-sm text-[#38291F] outline-none transition focus:border-[#80583D]"
        />
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.4, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white"
      >
        <div className="flex items-center justify-between border-b border-[#E9DED2] p-5">
          <div>
            <h2 className="font-bold text-[#38291F]">Payment History</h2>
            <p className="mt-1 text-xs text-[#806F62]">
              {filtered.length} transactions
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={fetchTransactions}
            disabled={loading}
            title="Refresh transactions"
            className="cursor-pointer rounded-lg border border-[#E9DED2] p-2 text-[#80583D] transition hover:bg-[#FAF7F2] disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#80583D]" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <CreditCard className="mx-auto mb-3 text-[#A47754]" size={35} />
            <p className="text-[#806F62]">No transactions found.</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 text-left">
              <thead className="bg-[#FAF7F2] text-xs uppercase text-[#806F62]">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Appointment</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Stripe Reference</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Transaction Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E9DED2]">
                {filtered.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(index * 0.05, 0.4),
                      ease: "easeOut",
                    }}
                    className="transition-colors hover:bg-[#FAF7F2]/60"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#38291F]">
                        {item.customerId?.name || "Unknown Customer"}
                      </p>
                      <p className="text-xs text-[#806F62]">
                        {item.customerId?.email || "No email"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#38291F]">
                      {item.service?.serviceName || "Service"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#806F62]">
                      {item.appointmentDate
                        ? new Date(item.appointmentDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#80583D]">
                      {item.currency?.toUpperCase() || "BDT"}{" "}
                      {item.amount?.toLocaleString() || 0}
                    </td>

                    <td className="px-5 py-4">
                      {item.stripeSessionId ? (
                        <div className="inline-flex items-center gap-2 rounded-lg border border-[#E9DED2] bg-[#FAF7F2] px-2.5 py-1.5">
                          <span
                            title={item.stripeSessionId}
                            className="font-mono text-xs font-medium text-[#38291F]"
                          >
                            {`${item.stripeSessionId.slice(0, 7)}...`}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopyReference(item.stripeSessionId!)
                            }
                            title="Copy Full Stripe Reference"
                            className="inline-flex cursor-pointer items-center gap-1 rounded bg-white px-2 py-0.5 text-[11px] font-semibold text-[#80583D] shadow-2xs transition hover:bg-[#F3ECE3] active:scale-95"
                          >
                            {copiedId === item.stripeSessionId ? (
                              <>
                                <Check size={12} className="text-green-600" />
                                <span className="text-green-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#806F62]">N/A</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          item.status === "paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {item.status === "paid" ? (
                          <CheckCircle size={13} />
                        ) : (
                          <XCircle size={13} />
                        )}
                        {item.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#806F62]">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
