"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Scissors,
  RefreshCw,
  Search,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiFetch } from "@/lib/api-fetch";

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

const CATEGORIES = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

function ManageServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusParam = searchParams.get("status");

  const statusFilter: "all" | "active" | "inactive" =
    statusParam === "active" || statusParam === "inactive"
      ? statusParam
      : "all";

  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IService | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");

  const handleStatusTabChange = (newStatus: "all" | "active" | "inactive") => {
    if (newStatus === "all") {
      router.replace("/dashboard/admin/services", { scroll: false });
    } else {
      router.replace(`/dashboard/admin/services?status=${newStatus}`, {
        scroll: false,
      });
    }
  };

  const fetchServices = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const response = await apiFetch("/admin/services", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch services");
      }

      setServices(result.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load services",
      );
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const filteredServices = services
    .filter((service) => {
      const matchesSearch =
        service.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        (service.description || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" ||
        service.category.toLowerCase() === category.toLowerCase();

      const matchesStatus =
        statusFilter === "all" || service.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-asc":
          return a.serviceName.localeCompare(b.serviceName);
        case "name-desc":
          return b.serviceName.localeCompare(a.serviceName);
        default:
          return 0;
      }
    });

  const handleRefresh = () => {
    void fetchServices();
  };

  useEffect(() => {
    void Promise.resolve().then(() => fetchServices());
  }, []);

  // Toggle service status with Sonner Toast
  const handleStatusChange = async (service: IService) => {
    try {
      setUpdatingId(service._id);

      const newStatus = service.status === "active" ? "inactive" : "active";

      const response = await apiFetch(`/admin/services/${service._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update failed");
      }

      toast.success(result.message || `Service marked as ${newStatus}`);
      await fetchServices(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete service confirmed from Shadcn AlertDialog
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      const response = await apiFetch(`/admin/services/${deleteTarget._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      toast.success(result.message || "Service deleted successfully");
      setServices((previous) =>
        previous.filter((service) => service._id !== deleteTarget._id),
      );
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service",
      );
    } finally {
      setDeleting(false);
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

      {/* Summary Cards */}
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

      {/* Status Pill Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {(["all", "active", "inactive"] as const).map((tab) => {
          const isSelected = statusFilter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleStatusTabChange(tab)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold capitalize transition ${
                isSelected
                  ? "bg-[#80583D] text-white shadow-sm"
                  : "border border-[#E9DED2] bg-white text-[#5C4B3E] hover:bg-[#FAF7F2]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8778]"
          />

          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E9DED2] bg-white py-3 pl-11 pr-4 text-sm text-[#38291F] outline-none transition placeholder:text-[#A99A8D] focus:border-[#80583D] focus:ring-2 focus:ring-[#80583D]/10"
          />
        </div>

        {/* Updated Category Filter */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#E9DED2] bg-white px-4 py-3 text-sm text-[#38291F] outline-none transition focus:border-[#80583D] focus:ring-2 focus:ring-[#80583D]/10"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#E9DED2] bg-white px-4 py-3 text-sm text-[#38291F] outline-none transition focus:border-[#80583D] focus:ring-2 focus:ring-[#80583D]/10"
          >
            <option value="">Default Sorting</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm">
        {/* Table Header */}
        <div className="flex items-center justify-between border-b border-[#E9DED2] p-4 sm:p-5">
          <div>
            <h2 className="font-bold capitalize text-[#38291F]">
              {statusFilter === "all"
                ? "All Services"
                : `${statusFilter} Services`}
            </h2>
            <p className="mt-1 text-xs text-[#806F62]">
              Showing {filteredServices.length} of {services.length} services
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
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="rounded-full bg-[#EDE0D3] p-5 text-[#80583D]">
              <Scissors size={30} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#38291F]">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-[#806F62]">
              {statusFilter !== "all" || category !== "all" || search
                ? "Try changing your active tab, category, or search filter."
                : "Add your first salon service to get started."}
            </p>

            {statusFilter === "all" && category === "all" && !search && (
              <Link
                href="/dashboard/admin/services/add"
                className="mt-5 rounded-xl bg-[#80583D] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Add Service
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="divide-y divide-[#E9DED2] md:hidden">
              {filteredServices.map((service) => (
                <div key={service._id} className="space-y-4 p-4">
                  <div className="flex items-start gap-3">
                    <Image
                      src={service.image}
                      alt={service.serviceName}
                      width={500}
                      height={500}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#38291F]">
                        {service.serviceName}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-xs text-[#9A8778]">
                        {service.description}
                      </p>

                      <span className="mt-2 inline-block rounded-full bg-[#EDE0D3] px-3 py-1 text-xs font-medium text-[#80583D]">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#FAF7F2] p-3">
                    <div>
                      <p className="text-xs text-[#806F62]">Price</p>
                      <p className="mt-1 font-bold text-[#38291F]">
                        ৳{service.price.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#806F62]">Duration</p>
                      <p className="mt-1 font-semibold text-[#38291F]">
                        {service.duration} min
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleStatusChange(service)}
                      disabled={updatingId === service._id}
                      className={`rounded-full px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${
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

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/admin/services/add?id=${service._id}`}
                        title="Edit Service"
                        className="rounded-lg bg-[#EDE0D3] p-2.5 text-[#80583D] transition hover:bg-[#E3D1BD]"
                      >
                        <Pencil size={17} />
                      </Link>

                      <button
                        onClick={() => setDeleteTarget(service)}
                        title="Delete Service"
                        className="rounded-lg bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
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
                  {filteredServices.map((service) => (
                    <tr
                      key={service._id}
                      className="transition hover:bg-[#FAF7F2]/70"
                    >
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

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[#EDE0D3] px-3 py-1.5 text-xs font-medium text-[#80583D]">
                          {service.category}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-[#38291F]">
                        ৳{service.price.toLocaleString("en-BD")}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#806F62]">
                        {service.duration} min
                      </td>

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
                            onClick={() => setDeleteTarget(service)}
                            title="Delete Service"
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100 cursor-pointer"
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
          </>
        )}
      </div>

      {/* Shadcn Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="border-[#E9DED2] bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#38291F]">
              Delete Service?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#806F62]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#38291F]">
                &ldquo;{deleteTarget?.serviceName}&rdquo;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="border-[#E9DED2] text-[#5C4B3E] hover:bg-[#FAF7F2] cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleConfirmDelete();
              }}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              {deleting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ManageServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#80583D]" />
        </div>
      }
    >
      <ManageServicesContent />
    </Suspense>
  );
}
