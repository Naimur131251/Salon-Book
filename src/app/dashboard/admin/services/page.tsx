"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Scissors,
  ImagePlus,
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

const initialForm = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  image: "",
};

export default function ManageServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/admin/services`, {
        // credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setServices(result.data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch services",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchServices();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchServices]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (service: IService) => {
    setEditingId(service._id);

    setForm({
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: String(service.price),
      duration: String(service.duration),
      image: service.image,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const isEditing = Boolean(editingId);

      const response = await fetch(
        isEditing
          ? `${API_URL}/admin/services/${editingId}`
          : `${API_URL}/admin/services`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          //   credentials: "include",
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            duration: Number(form.duration),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Operation failed");
      }

      setSuccess(result.message);
      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);

      await fetchServices();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/admin/services/${id}`, {
        method: "DELETE",
        // credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setSuccess(result.message);
      await fetchServices();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete service",
      );
    }
  };

  const toggleStatus = async (service: IService) => {
    try {
      const newStatus = service.status === "active" ? "inactive" : "active";

      const response = await fetch(
        `${API_URL}/admin/services/${service._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          //   credentials: "include",
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setSuccess(result.message);
      await fetchServices();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update status",
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#A47754]">Salon Management</p>

          <h1 className="mt-2 text-3xl font-bold text-[#38291F]">
            Manage Services
          </h1>

          <p className="mt-2 text-sm text-[#806F62]">
            Add, update and manage your salon services.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#80583D] px-5 py-3 font-semibold text-white transition hover:bg-[#62432E]"
        >
          <Plus size={19} />
          Add New Service
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="mt-6 rounded-xl bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button onClick={() => setError("")} className="ml-3 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mt-8 rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#38291F]">
              {editingId ? "Update Service" : "Add New Service"}
            </h2>

            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg p-2 text-[#80583D] hover:bg-[#FAF7F2]"
            >
              <X size={21} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38291F]">
                  Service Name
                </label>
                <input
                  required
                  name="serviceName"
                  value={form.serviceName}
                  onChange={handleChange}
                  placeholder="Hair Styling"
                  className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38291F]">
                  Category
                </label>
                <select
                  required
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
                >
                  <option value="">Select Category</option>
                  <option value="Hair">Hair</option>
                  <option value="Skin">Skin</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Nail">Nail</option>
                  <option value="Spa">Spa</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38291F]">
                  Price (৳)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="1500"
                  className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#38291F]">
                  Duration (Minutes)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="60"
                  className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#38291F]">
                  Service Image URL
                </label>

                <div className="flex items-center gap-2">
                  <ImagePlus className="text-[#A47754]" />
                  <input
                    required
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#38291F]">
                  Description
                </label>

                <textarea
                  required
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this salon service..."
                  className="w-full resize-none rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
                />
              </div>
            </div>

            <button
              disabled={saving}
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#80583D] px-6 py-3 font-semibold text-white hover:bg-[#62432E] disabled:opacity-60"
            >
              {saving && <Loader2 size={18} className="animate-spin" />}
              {editingId ? "Update Service" : "Save Service"}
            </button>
          </form>
        </div>
      )}

      {/* Services Table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm">
        <div className="border-b border-[#E9DED2] p-5">
          <h2 className="font-bold text-[#38291F]">
            All Services ({services.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[#80583D]" size={32} />
          </div>
        ) : services.length === 0 ? (
          <div className="py-16 text-center">
            <Scissors className="mx-auto mb-3 text-[#A47754]" size={35} />
            <p className="font-semibold text-[#38291F]">No services found</p>
            <p className="mt-2 text-sm text-[#806F62]">
              Start by adding your first salon service.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
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
                  <tr key={service._id} className="hover:bg-[#FAF7F2]/70">
                    <td className="px-5 py-4">
                      <div className="flex min-w-47.5 items-center gap-3">
                        <Image
                          src={service.image}
                          alt={service.serviceName}
                          className="h-12 w-12 rounded-xl object-cover"
                          width={500}
                          height={500}
                        />

                        <span className="font-semibold text-[#38291F]">
                          {service.serviceName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#806F62]">
                      {service.category}
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#80583D]">
                      ৳{service.price.toLocaleString("en-BD")}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#806F62]">
                      {service.duration} min
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(service)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          service.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {service.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditForm(service)}
                          title="Edit service"
                          className="rounded-lg bg-[#EDE0D3] p-2 text-[#80583D] hover:bg-[#E3D1BD]"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(service._id)}
                          title="Delete service"
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
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
