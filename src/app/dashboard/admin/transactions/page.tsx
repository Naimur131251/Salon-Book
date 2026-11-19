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
} from "lucide-react";
import { apiFetch } from "@/lib/api-fetch";

// const API_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface ITransaction {
  _id: string;
  appointmentId: string;
  customerId: {
    name: string;
    email: string;
  };
  service: {
    serviceName: string;
    image?: string;
  };
  appointmentDate: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/admin/transactions", {
        // credentials: "include",
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setTransactions(result.data);
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
    `${item.customerId?.name} ${item.customerId?.email} ${item.stripeSessionId}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const paid = transactions.filter((t) => t.status === "paid");
  const failed = transactions.filter((t) => t.status === "failed");

  const totalRevenue = paid.reduce((total, item) => total + item.amount, 0);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-[#A47754]">
          Financial Management
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#38291F]">Transactions</h1>
        <p className="mt-2 text-sm text-[#806F62]">
          Monitor Stripe payment transactions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
          <p className="text-sm text-[#806F62]">Total Transactions</p>
          <h2 className="mt-2 text-2xl font-bold text-[#38291F]">
            {transactions.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
          <p className="text-sm text-[#806F62]">Successful Payments</p>
          <h2 className="mt-2 text-2xl font-bold text-green-700">
            {paid.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
          <p className="text-sm text-[#806F62]">Total Revenue</p>
          <h2 className="mt-2 text-2xl font-bold text-[#80583D]">
            ৳{totalRevenue.toLocaleString("en-BD")}
          </h2>
          <p className="mt-1 text-xs text-[#806F62]">
            {failed.length} failed transactions excluded
          </p>
        </div>
      </div>

      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18B78]"
          size={19}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer or Stripe session..."
          className="w-full rounded-xl border border-[#E9DED2] bg-white py-3 pl-11 pr-4 outline-none focus:border-[#80583D]"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white">
        <div className="flex items-center justify-between border-b border-[#E9DED2] p-5">
          <div>
            <h2 className="font-bold text-[#38291F]">Payment History</h2>
            <p className="mt-1 text-xs text-[#806F62]">
              {filtered.length} transactions
            </p>
          </div>

          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="rounded-lg border border-[#E9DED2] p-2 text-[#80583D]"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#80583D]" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <CreditCard className="mx-auto mb-3 text-[#A47754]" size={35} />
            <p className="text-[#806F62]">No transactions found.</p>
          </div>
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
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#38291F]">
                        {item.customerId?.name}
                      </p>
                      <p className="text-xs text-[#806F62]">
                        {item.customerId?.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#38291F]">
                      {item.service?.serviceName || "Service"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#806F62]">
                      {new Date(item.appointmentDate).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#80583D]">
                      {item.currency?.toUpperCase()}{" "}
                      {item.amount.toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        title={item.stripeSessionId}
                        className="text-xs text-[#806F62]"
                      >
                        {item.stripeSessionId
                          ? `${item.stripeSessionId.slice(0, 15)}...`
                          : "N/A"}
                      </span>
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
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
