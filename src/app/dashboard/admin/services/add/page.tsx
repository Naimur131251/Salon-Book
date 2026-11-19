"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/lib/api-fetch";

// const API_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const categories = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

interface IService {
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
}

function ServiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState<IService>({
    serviceName: "",
    category: "",
    description: "",
    price: 0,
    duration: 60,
    image: "",
    status: "active",
  });

  useEffect(() => {
    if (!editId) return;

    const fetchService = async () => {
      try {
        const res = await apiFetch(`/admin/services/${editId}`, {
          // credentials: "include",
          cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.message);

        setForm(result.data);
        setPreview(result.data.image);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Service not found",
        );
      } finally {
        setFetching(false);
      }
    };

    fetchService();
  }, [editId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "duration"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be below 5MB");
      return;
    }

    if (!IMGBB_KEY) {
      toast.error("ImgBB API key is missing");
      return;
    }

    setUploading(true);

    try {
      const body = new FormData();
      body.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        {
          method: "POST",
          body,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || "Image upload failed");
      }

      setForm((prev) => ({
        ...prev,
        image: result.data.url,
      }));

      setPreview(result.data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.serviceName.trim() ||
      !form.category ||
      !form.description.trim() ||
      !form.image
    ) {
      toast.error("Please complete all required fields");
      return;
    }

    if (!Number.isFinite(form.price) || form.price <= 0) {
      toast.error("Price must be a positive number");
      return;
    }

    if (!Number.isFinite(form.duration) || form.duration <= 0) {
      toast.error("Duration must be a positive number");
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch(
        editId
          ? `/admin/services/${editId}`
          : "/admin/services",
        {
          method: editId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          // credentials: "include",
          body: JSON.stringify(form),
        },
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      toast.success(result.message || "Service saved successfully");

      router.push("/dashboard/admin/services");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#80583D]" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div>
        <Link
          href="/dashboard/admin/services"
          className="mb-5 inline-flex items-center gap-2 text-sm text-[#80583D] hover:underline"
        >
          <ArrowLeft size={17} /> Back to Services
        </Link>

        <h1 className="text-3xl font-bold text-[#38291F]">
          {editId ? "Update Service" : "Add New Service"}
        </h1>

        <p className="mt-2 text-sm text-[#806F62]">
          Manage your salon service information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#38291F]">
              Service Name *
            </label>
            <input
              required
              name="serviceName"
              value={form.serviceName}
              onChange={handleChange}
              placeholder="e.g. Hair Styling"
              className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#38291F]">
              Service Category *
            </label>
            <select
              required
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#38291F]">
              Price (৳) *
            </label>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              placeholder="1500"
              className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#38291F]">
              Estimated Duration (Minutes) *
            </label>
            <input
              required
              type="number"
              min="1"
              name="duration"
              value={form.duration || ""}
              onChange={handleChange}
              placeholder="60"
              className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#38291F]">
              Description *
            </label>
            <textarea
              required
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your salon service..."
              className="w-full resize-none rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
            />
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-[#38291F]">
            Service Image *
          </label>

          {preview ? (
            <div className="relative h-56 max-w-md overflow-hidden rounded-xl border border-[#E9DED2]">
              <Image
                src={preview}
                alt="Service preview"
                className="h-full w-full object-cover"
                width={500}
                height={500}
              />
              <button
                type="button"
                onClick={() => {
                  setPreview("");
                  setForm((prev) => ({ ...prev, image: "" }));
                }}
                className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <label className="flex max-w-md cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#CDB9A5] bg-[#FAF7F2] p-10 text-center">
              {uploading ? (
                <Loader2 className="animate-spin text-[#80583D]" size={30} />
              ) : (
                <>
                  <ImagePlus size={35} className="text-[#80583D]" />
                  <span className="mt-3 font-semibold text-[#38291F]">
                    Upload Service Image
                  </span>
                  <span className="mt-1 text-xs text-[#806F62]">
                    PNG, JPG or WEBP (Max 5MB)
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={uploadImage}
                disabled={uploading}
              />
            </label>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#38291F]">
            Service Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-4 py-3 outline-none focus:border-[#80583D]"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button
          disabled={loading || uploading}
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#80583D] px-6 py-3.5 font-semibold text-white transition hover:bg-[#62432E] disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={19} />
          ) : (
            <Upload size={18} />
          )}
          {editId ? "Update Service" : "Save Service"}
        </button>
      </form>
    </div>
  );
}

export default function AddServicePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <ServiceForm />
    </Suspense>
  );
}
