"use client";

import { useCallback, useEffect, useState, useMemo, Suspense } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDays,
  Clock,
  CreditCard,
  XCircle,
  Loader2,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api-fetch";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Appointment {
  _id: string;
  appointmentDate: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  stripeSessionId?: string;
  servicePrice: number;
  service?: {
    serviceName: string;
    image: string;
    category: string;
  };
}

function CustomerAppointmentsContent() {
  const { data: session, isPending } = useSession();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusFromUrl = searchParams.get("status");

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const handleCopyTransaction = async (sessionId: string) => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopiedId(sessionId);
      toast.success("Transaction ID copied!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy ID");
    }
  };

  const isValidStatus =
    statusFromUrl &&
    ["pending", "confirmed", "cancelled", "paid"].includes(statusFromUrl);

  const activeFilter = isValidStatus ? statusFromUrl : "all";

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

  const refreshAppointments = () => {
    setLoading(true);
    void fetchAppointments();
  };

  useEffect(() => {
    if (isPending || !customerId) return;
    void Promise.resolve().then(fetchAppointments);
  }, [customerId, isPending, fetchAppointments]);

  const handleConfirmCancel = async () => {
    if (!customerId || !cancelTarget) return;

    try {
      setProcessing(cancelTarget._id);

      const res = await apiFetch(
        `/customer/appointments/${cancelTarget._id}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId }),
        },
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success(result.message || "Appointment cancelled successfully!");
      setCancelTarget(null);
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

      if (!res.ok) {
        throw new Error(result.message || "Payment failed");
      }

      if (!result.url) {
        throw new Error("Stripe checkout URL not found");
      }

      window.location.assign(result.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
      setProcessing("");
    }
  };

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (activeFilter === "paid") {
      result = result.filter((item) => item.paymentStatus === "paid");
    } else if (activeFilter !== "all") {
      result = result.filter((item) => item.status === activeFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.appointmentDate).getTime();
      const dateB = new Date(b.appointmentDate).getTime();

      switch (sortBy) {
        case "oldest":
        case "date-asc":
          return dateA - dateB;
        case "newest":
        case "date-desc":
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
    return <p className="p-8 text-[#38291F]">Please sign in first.</p>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-7"
    >
      {/* Header */}
      <motion.div
        variants={fadeUpVariants}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <p className="text-sm font-medium text-[#A47754]">Customer Portal</p>
          <h1 className="mt-2 text-3xl font-bold text-[#38291F]">
            My Appointments
          </h1>
          <p className="mt-2 text-sm text-[#806F62]">
            View, manage, and track your salon bookings.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={refreshAppointments}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#E9DED2] bg-white px-4 py-3 text-sm font-semibold text-[#80583D] transition hover:bg-[#FAF7F2] disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={containerVariants}
        className="grid gap-4 sm:grid-cols-3"
      >
        {[
          { label: "Total", value: appointments.length },
          {
            label: "Pending",
            value: appointments.filter((a) => a.status === "pending").length,
          },
          {
            label: "Confirmed",
            value: appointments.filter((a) => a.status === "confirmed").length,
          },
        ].map((item) => (
          <motion.div
            key={item.label}
            variants={fadeUpVariants}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-[#E9DED2] bg-white p-5"
          >
            <p className="text-sm text-[#806F62]">{item.label} Appointments</p>
            <h2 className="mt-2 text-2xl font-bold text-[#38291F]">
              {item.value}
            </h2>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter and Sorting */}
      <motion.div
        variants={fadeUpVariants}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "confirmed", "cancelled", "paid"].map(
            (status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                  activeFilter === status
                    ? "bg-[#80583D] text-white"
                    : "border border-[#E9DED2] bg-white text-[#806F62] hover:bg-[#FAF7F2]"
                }`}
              >
                {status}
              </motion.button>
            ),
          )}
        </div>

        <div className="w-full sm:w-60">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-[#E9DED2] bg-white px-4 py-2.5 text-sm font-medium text-[#38291F] outline-none focus:border-[#80583D]"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="date-asc">Appointment Date: Earliest</option>
            <option value="date-desc">Appointment Date: Latest</option>
          </select>
        </div>
      </motion.div>

      {/* Appointment Service Cards */}
      <div className="w-full space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -2 }}
                className="grid w-full min-w-0 grid-cols-[76px_minmax(0,1fr)] gap-3 rounded-2xl border border-[#eadfd5] bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-5 sm:p-5"
              >
                {/* Service Image */}
                <div className="relative h-20 w-19 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                  <Image
                    src={item.service?.image || "/placeholder.png"}
                    alt={item.service?.serviceName || "Service"}
                    fill
                    sizes="(max-width: 640px) 76px, 112px"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Service Information */}
                <div className="min-w-0">
                  {/* Title and Status */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="wrap-break-words text-sm font-bold text-[#352A24] sm:text-base">
                        {item.service?.serviceName || "Service"}
                      </h3>
                      <p className="mt-1 text-xs text-[#927D70] sm:text-sm">
                        {item.service?.category || "General"}
                      </p>
                    </div>

                    {/* Only One Appointment Status */}
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold capitalize sm:text-xs ${
                        item.status === "confirmed"
                          ? "bg-[#f5eadc] text-[#8B5E3C]"
                          : item.status === "cancelled"
                            ? "bg-red-50 text-red-600"
                            : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  {/* Date and Time */}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#927D70] sm:text-xs">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      {new Date(item.appointmentDate).toLocaleDateString()}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {item.timeSlot}
                    </span>
                  </div>

                  {/* Price and Payment */}
                  {/* Price and Payment */}
                  <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#352A24]">
                        ৳{item.servicePrice}
                      </p>

                      <p className="mt-1 text-[11px] text-[#927D70]">
                        Payment:{" "}
                        <span
                          className={
                            item.paymentStatus === "paid"
                              ? "font-semibold text-green-600"
                              : "text-[#927D70]"
                          }
                        >
                          {item.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                      </p>
                    </div>

                    {/* Payment and Cancel Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* ১. শুধুমাত্র Pending অবস্থায় Cancel বাটন দেখাবে */}
                      {item.paymentStatus === "unpaid" &&
                        item.status === "pending" && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={processing === item._id}
                            onClick={() => setCancelTarget(item)}
                            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            {processing === item._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            Cancel
                          </motion.button>
                        )}

                      {/* Paid হলে Transaction ID ও Copy বাটন দেখাবে */}
                      {item.paymentStatus === "paid" &&
                        item.stripeSessionId && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#FAF7F2] px-2.5 py-1.5 text-[11px] text-[#806F62]">
                            <span className="font-medium text-[#A47754]">
                              Txn ID:
                            </span>
                            <span
                              title={item.stripeSessionId}
                              className="font-mono font-semibold text-[#38291F]"
                            >
                              {item.stripeSessionId.length > 18
                                ? `${item.stripeSessionId.slice(0, 10)}...${item.stripeSessionId.slice(-6)}`
                                : item.stripeSessionId}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyTransaction(item.stripeSessionId!)
                              }
                              title="Copy Transaction ID"
                              className="ml-0.5 inline-flex cursor-pointer items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#80583D] shadow-2xs transition hover:bg-[#F3ECE3] active:scale-95"
                            >
                              {copiedId === item.stripeSessionId ? (
                                <>
                                  <Check size={11} className="text-green-600" />
                                  <span className="text-green-600">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={11} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                      {/* ২. শুধুমাত্র Confirmed অবস্থায় Cancel-এর বদলে Pay Now (বা Paid ব্যাজ) দেখাবে */}
                      {item.status === "confirmed" &&
                        (item.paymentStatus === "paid" ? (
                          <span className="rounded-lg bg-green-50 px-4 py-2 text-xs font-semibold text-green-600">
                            Paid
                          </span>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={processing === item._id}
                            onClick={() => handlePayment(item._id)}
                            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-[#8B5E3C] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#70482E] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                          >
                            {processing === item._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CreditCard size={14} />
                            )}
                            {processing === item._id
                              ? "Processing..."
                              : "Pay Now"}
                          </motion.button>
                        ))}
                    </div>
                  </div>
                </div>
                {/* Shadcn Cancel Confirmation Dialog */}
                <Dialog
                  open={!!cancelTarget}
                  onOpenChange={(open) => {
                    if (!open && !processing) setCancelTarget(null);
                  }}
                >
                  <DialogContent className="border-[#E9DED2] bg-white sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-[#38291F]">
                        Cancel Appointment
                      </DialogTitle>
                      <DialogDescription className="pt-2 text-sm text-[#806F62]">
                        Are you sure you want to cancel your appointment for{" "}
                        <span className="font-semibold text-[#38291F]">
                          {cancelTarget?.service?.serviceName || "this service"}
                        </span>{" "}
                        on{" "}
                        <span className="font-semibold text-[#38291F]">
                          {cancelTarget?.appointmentDate
                            ? new Date(
                                cancelTarget.appointmentDate,
                              ).toLocaleDateString()
                            : ""}
                        </span>
                        ? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
                      <button
                        type="button"
                        disabled={!!processing}
                        onClick={() => setCancelTarget(null)}
                        className="cursor-pointer rounded-xl border border-[#E9DED2] bg-white px-4 py-2.5 text-sm font-semibold text-[#806F62] transition hover:bg-[#FAF7F2] disabled:opacity-50"
                      >
                        Keep Appointment
                      </button>

                      <button
                        type="button"
                        disabled={!!processing}
                        onClick={handleConfirmCancel}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                      >
                        {processing && (
                          <Loader2 size={15} className="animate-spin" />
                        )}
                        Yes, Cancel
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-[#E9DED2] bg-white py-16 text-center"
            >
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
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleFilterChange("all")}
                  className="mt-5 rounded-lg bg-[#80583D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#62432E]"
                >
                  Clear Filter
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function MyAppointmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-80 items-center justify-center">
          <Loader2 className="animate-spin text-[#80583D]" size={32} />
        </div>
      }
    >
      <CustomerAppointmentsContent />
    </Suspense>
  );
}
