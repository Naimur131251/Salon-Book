"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // ১. useSearchParams ইম্পোর্ট করা হয়েছে
import { toast } from "sonner";
import { Eye, Check, X, Loader2, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/api-fetch";

// const API_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface IAppointment {
  _id: string;
  customerId: {
    name: string;
    email: string;
    image?: string;
  };
  serviceId: {
    serviceName: string;
    category: string;
    image: string;
  };
  appointmentDate: string;
  timeSlot: string;
  message?: string;
  servicePrice: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
}

// মূল কন্টেন্ট আলাদা কম্পোনেন্টে রাখা হয়েছে যাতে Suspense ব্যবহার করা যায়
function AppointmentsContent() {
  const searchParams = useSearchParams();
  const statusFromUrl = searchParams.get("status"); // ২. URL থেকে status নেওয়া হলো

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<IAppointment | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const [manualFilter, setManualFilter] = useState<{
    statusFromUrl: string | null;
    filter: string;
  } | null>(null);
  const isValidStatus =
    statusFromUrl &&
    ["pending", "confirmed", "cancelled"].includes(statusFromUrl);
  const filter =
    manualFilter?.statusFromUrl === statusFromUrl
      ? manualFilter.filter
      : isValidStatus
        ? statusFromUrl
        : "all";

  const fetchAppointments = async () => {
    try {
      const res = await apiFetch("/admin/appointments", {
        cache: "no-store",
      });

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
  };

  const refreshAppointments = () => {
    setLoading(true);
    void fetchAppointments();
  };

  useEffect(() => {
    void Promise.resolve().then(fetchAppointments);
  }, []);

  const updateStatus = async (
    appointment: IAppointment,
    status: "confirmed" | "cancelled",
  ) => {
    if (status === "confirmed" && appointment.status !== "pending") {
      toast.error("Only pending appointments can be confirmed");
      return;
    }

    if (
      status === "cancelled" &&
      !["pending", "confirmed"].includes(appointment.status)
    ) {
      toast.error("This appointment cannot be cancelled");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${status} this appointment?`,
    );

    if (!confirmed) return;

    try {
      setUpdating(appointment._id);

      const res = await apiFetch(
        `/admin/appointments/${appointment._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success(result.message || "Appointment updated");
      setSelected(null);
      refreshAppointments();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const filteredAppointments = appointments.filter((item) =>
    filter === "all" ? true : item.status === filter,
  );

  const statusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700";
      case "cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#A47754]">Salon Management</p>
          <h1 className="mt-2 text-3xl font-bold text-[#38291F]">
            Manage Appointments
          </h1>
          <p className="mt-2 text-sm text-[#806F62]">
            Review and manage customer appointment requests.
          </p>
        </div>

        <button
          onClick={refreshAppointments}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#E9DED2] px-4 py-3 text-sm font-semibold text-[#80583D]"
        >
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
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
          <div
            key={item.label}
            className="rounded-2xl border border-[#E9DED2] bg-white p-5"
          >
            <p className="text-sm text-[#806F62]">{item.label} Appointments</p>
            <h2 className="mt-2 text-2xl font-bold text-[#38291F]">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setManualFilter({ statusFromUrl, filter: status })}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
              filter === status
                ? "bg-[#80583D] text-white"
                : "border border-[#E9DED2] bg-white text-[#806F62]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#80583D]" size={32} />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <p className="py-16 text-center text-[#806F62]">
            No appointments found.
          </p>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="space-y-4 p-4 md:hidden">
              {filteredAppointments.map((item) => (
                <div
                  key={item._id}
                  className="space-y-4 rounded-xl border border-[#E9DED2] bg-[#FFFEFC] p-4"
                >
                  {/* Customer */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#38291F]">
                        {item.customerId?.name || "Unknown Customer"}
                      </p>
                      <p className="break-all text-xs text-[#806F62]">
                        {item.customerId?.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="h-px bg-[#E9DED2]" />

                  {/* Service */}
                  <div>
                    <p className="text-xs text-[#A47754]">Service</p>
                    <p className="mt-1 font-semibold text-[#38291F]">
                      {item.serviceId?.serviceName || "N/A"}
                    </p>
                    <p className="text-xs text-[#806F62]">
                      {item.serviceId?.category}
                    </p>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-[#A47754]">Date</p>
                      <p className="mt-1 text-sm font-medium text-[#38291F]">
                        {new Date(item.appointmentDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#A47754]">Time</p>
                      <p className="mt-1 text-sm font-medium text-[#38291F]">
                        {item.timeSlot}
                      </p>
                    </div>
                  </div>

                  {/* Price & Payment */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#A47754]">Price</p>
                      <p className="mt-1 font-bold text-[#80583D]">
                        ৳{item.servicePrice}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-xs text-[#A47754]">Payment</p>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.paymentStatus === "paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-[#E9DED2]" />

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelected(item)}
                      title="View Details"
                      className="flex items-center gap-2 rounded-lg bg-[#EDE0D3] px-3 py-2 text-sm font-semibold text-[#80583D]"
                    >
                      <Eye size={16} />
                      Details
                    </button>

                    <div className="flex items-center gap-2">
                      {item.status === "pending" && (
                        <button
                          disabled={updating === item._id}
                          onClick={() => updateStatus(item, "confirmed")}
                          title="Confirm"
                          className="rounded-lg bg-green-50 p-2 text-green-700 disabled:opacity-50"
                        >
                          <Check size={17} />
                        </button>
                      )}

                      {["pending", "confirmed"].includes(item.status) && (
                        <button
                          disabled={updating === item._id}
                          onClick={() => updateStatus(item, "cancelled")}
                          title="Cancel"
                          className="rounded-lg bg-red-50 p-2 text-red-600 disabled:opacity-50"
                        >
                          <X size={17} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-237.5 text-left">
                <thead className="bg-[#FAF7F2] text-xs uppercase text-[#806F62]">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Service</th>
                    <th className="px-5 py-4">Date & Time</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E9DED2]">
                  {filteredAppointments.map((item) => (
                    <tr key={item._id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#38291F]">
                          {item.customerId?.name}
                        </p>
                        <p className="text-xs text-[#806F62]">
                          {item.customerId?.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-[#38291F]">
                          {item.serviceId?.serviceName}
                        </p>
                        <p className="text-xs text-[#806F62]">
                          {item.serviceId?.category}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#806F62]">
                        <p>
                          {new Date(item.appointmentDate).toLocaleDateString()}
                        </p>
                        <p>{item.timeSlot}</p>
                      </td>

                      <td className="px-5 py-4 font-semibold text-[#80583D]">
                        ৳{item.servicePrice}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.paymentStatus === "paid"
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(item)}
                            title="View Details"
                            className="rounded-lg bg-[#EDE0D3] p-2 text-[#80583D]"
                          >
                            <Eye size={17} />
                          </button>

                          {item.status === "pending" && (
                            <button
                              disabled={updating === item._id}
                              onClick={() => updateStatus(item, "confirmed")}
                              title="Confirm"
                              className="rounded-lg bg-green-50 p-2 text-green-700 disabled:opacity-50"
                            >
                              <Check size={17} />
                            </button>
                          )}

                          {["pending", "confirmed"].includes(item.status) && (
                            <button
                              disabled={updating === item._id}
                              onClick={() => updateStatus(item, "cancelled")}
                              title="Cancel"
                              className="rounded-lg bg-red-50 p-2 text-red-600 disabled:opacity-50"
                            >
                              <X size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#38291F]">
                Appointment Details
              </h2>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="font-semibold text-[#38291F]">Customer</p>
                <p className="text-[#806F62]">{selected.customerId?.name}</p>
                <p className="text-[#806F62]">{selected.customerId?.email}</p>
              </div>

              <div>
                <p className="font-semibold text-[#38291F]">Service</p>
                <p className="text-[#806F62]">
                  {selected.serviceId?.serviceName}
                </p>
                <p className="text-[#806F62]">{selected.serviceId?.category}</p>
              </div>

              <div>
                <p className="font-semibold text-[#38291F]">Appointment</p>
                <p className="text-[#806F62]">
                  {new Date(selected.appointmentDate).toLocaleDateString()} ·{" "}
                  {selected.timeSlot}
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#38291F]">Customer Message</p>
                <p className="text-[#806F62]">
                  {selected.message || "No additional message"}
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#38291F]">Service Price</p>
                <p className="text-[#806F62]">৳{selected.servicePrice}</p>
              </div>

              <div>
                <p className="font-semibold text-[#38291F]">
                  Booking Request Date
                </p>
                <p className="text-[#806F62]">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>

              <p className="text-[#806F62]">
                Status: {selected.status} · Payment: {selected.paymentStatus}
              </p>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-xl bg-[#80583D] py-3 font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManageAppointmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-[#80583D]" size={35} />
        </div>
      }
    >
      <AppointmentsContent />
    </Suspense>
  );
}
