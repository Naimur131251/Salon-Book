"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Scissors,
  RefreshCw,
} from "lucide-react";
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

const API_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export default function ManageServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch all services
  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/services`, {
        // credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch services");
      }

      setServices(result.data);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    void fetchServices();
  };

  useEffect(() => {
    void Promise.resolve().then(fetchServices);
  }, []);

  // Toggle service status
  const handleStatusChange = async (service: IService) => {
    try {
      setUpdatingId(service._id);
      setMessage("");
      setError("");

      const newStatus = service.status === "active" ? "inactive" : "active";

      const response = await fetch(
        `${API_URL}/admin/services/${service._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          //   credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update failed");
      }

      setMessage(result.message);
      await fetchServices();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete service
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API_URL}/admin/services/${id}`, {
        method: "DELETE",
        // credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      setMessage(result.message);
      setServices((previous) =>
        previous.filter((service) => service._id !== id),
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete service",
      );
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#A47754]">Salon Management</p>

          <h1 className="mt-2 text-3xl font-bold text-[#38291F]">
            Manage Services
          </h1>

          <p className="mt-2 text-sm text-[#806F62]">
            Manage all your salon services from here.
          </p>
        </div>

        <Link
          href="/dashboard/admin/services/add"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#80583D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#62432E]"
        >
          <Plus size={19} />
          Add New Service
        </Link>
      </div>

      {/* Messages */}
      {message && (
        <div className="flex items-center justify-between rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {message}
          <button onClick={() => setMessage("")}>✕</button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
          <p className="text-sm text-[#806F62]">Total Services</p>
          <h2 className="mt-2 text-2xl font-bold text-[#38291F]">
            {services.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
          <p className="text-sm text-[#806F62]">Active Services</p>
          <h2 className="mt-2 text-2xl font-bold text-green-700">
            {services.filter((s) => s.status === "active").length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
          <p className="text-sm text-[#806F62]">Inactive Services</p>
          <h2 className="mt-2 text-2xl font-bold text-red-600">
            {services.filter((s) => s.status === "inactive").length}
          </h2>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E9DED2] p-5">
          <div>
            <h2 className="font-bold text-[#38291F]">All Services</h2>
            <p className="mt-1 text-xs text-[#806F62]">
              {services.length} services available
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-lg border border-[#E9DED2] p-2 text-[#80583D] transition hover:bg-[#FAF7F2]"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 size={32} className="animate-spin text-[#80583D]" />
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="rounded-full bg-[#EDE0D3] p-5 text-[#80583D]">
              <Scissors size={30} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#38291F]">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-[#806F62]">
              Add your first salon service to get started.
            </p>

            <Link
              href="/dashboard/admin/services/add"
              className="mt-5 rounded-xl bg-[#80583D] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Add Service
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left">
              <thead className="bg-[#FAF7F2] text-xs uppercase text-[#806F62]">
                <tr>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Duration</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E9DED2]">
                {services.map((service) => (
                  <tr
                    key={service._id}
                    className="transition hover:bg-[#FAF7F2]/70"
                  >
                    {/* Service */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={service.image}
                          alt={service.serviceName}
                          className="h-12 w-12 rounded-xl object-cover"
                          width={500}
                          height={500}
                        />

                        <div>
                          <p className="font-semibold text-[#38291F]">
                            {service.serviceName}
                          </p>
                          <p className="mt-1 line-clamp-1 max-w-48 text-xs text-[#9A8778]">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#EDE0D3] px-3 py-1.5 text-xs font-medium text-[#80583D]">
                        {service.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 font-semibold text-[#38291F]">
                      ৳{service.price.toLocaleString("en-BD")}
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4 text-sm text-[#806F62]">
                      {service.duration} min
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleStatusChange(service)}
                        disabled={updatingId === service._id}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                          service.status === "active"
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        {updatingId === service._id
                          ? "Updating..."
                          : service.status === "active"
                            ? "Active"
                            : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/admin/services/add?id=${service._id}`}
                          title="Edit Service"
                          className="rounded-lg bg-[#EDE0D3] p-2 text-[#80583D] transition hover:bg-[#E3D1BD]"
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          onClick={() => handleDelete(service._id)}
                          title="Delete Service"
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
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
