"use client";

import { useEffect, useState } from "react";
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
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  Loader2,
  RefreshCw,
  X,
  User,
} from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api-fetch";

// const API_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  createdAt?: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<IUser | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [userToUpdate, setUserToUpdate] = useState<IUser | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/admin/users", {
        // credentials: "include",
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setUsers(result.data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load users",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchUsers);
  }, []);

  const handleBlock = async () => {
    if (!userToUpdate) return;

    const user = userToUpdate;
    const newStatus = !user.isBlocked;

    try {
      setUpdating(user._id);

      const res = await apiFetch(`/admin/users/${user._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: newStatus }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success(result.message || "User status updated");

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isBlocked: newStatus } : u,
        ),
      );

      if (selected?._id === user._id) {
        setSelected({ ...user, isBlocked: newStatus });
      }

      setUserToUpdate(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium text-[#A47754]">Salon Management</p>
        <h1 className="mt-2 text-3xl font-bold text-[#38291F]">Manage Users</h1>
        <p className="mt-2 text-sm text-[#806F62]">
          Manage registered salon customers.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
          <p className="text-sm text-[#806F62]">Total Customers</p>
          <h2 className="mt-2 text-2xl font-bold text-[#38291F]">
            {users.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
          <p className="text-sm text-[#806F62]">Active Customers</p>
          <h2 className="mt-2 text-2xl font-bold text-green-700">
            {users.filter((u) => !u.isBlocked).length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#E9DED2] bg-white p-5">
          <p className="text-sm text-[#806F62]">Blocked Customers</p>
          <h2 className="mt-2 text-2xl font-bold text-red-600">
            {users.filter((u) => u.isBlocked).length}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18B78]"
            size={19}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full rounded-xl border border-[#E9DED2] bg-white py-3 pl-11 pr-4 outline-none focus:border-[#80583D]"
          />
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#E9DED2] px-4 py-3 text-[#80583D]"
        >
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#80583D]" size={32} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="py-16 text-center text-[#806F62]">
            No customers found.
          </p>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="divide-y divide-[#E9DED2] md:hidden">
              {filteredUsers.map((user) => (
                <div key={user._id} className="space-y-4 p-4">
                  {/* Customer Info */}
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <Image
                        src={user.image || "/avatar.png"}
                        alt={user.name}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                        width={500}
                        height={500}
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8DCCB] text-[#352A24]">
                        <User size={20} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-[#38291F]">
                        {user.name}
                      </h3>
                      <p className="break-all text-xs text-[#806F62]">
                        {user.email}
                      </p>
                      <span
                        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          user.isBlocked
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#FAF7F2] p-3">
                    <div className="min-w-0">
                      <p className="text-xs text-[#806F62]">Phone</p>
                      <p className="mt-1 wrap-break-words text-sm font-medium text-[#38291F]">
                        {user.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#806F62]">Joined</p>
                      <p className="mt-1 text-sm font-medium text-[#38291F]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelected(user)}
                      className="flex items-center gap-2 rounded-lg bg-[#EDE0D3] px-3 py-2.5 text-sm font-semibold text-[#80583D] transition hover:bg-[#E3D1BD]"
                      title="View Details"
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    <button
                      disabled={updating === user._id}
                      onClick={() => setUserToUpdate(user)}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                        user.isBlocked
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                          : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
                      }`}
                    >
                      {updating === user._id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : user.isBlocked ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Ban size={14} />
                      )}

                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-187.5 text-left">
                <thead className="bg-[#FAF7F2] text-xs uppercase text-[#806F62]">
                  <tr>
                    <th className="px-9 py-4">Customer</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E9DED2]">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-[#FAF7F2]/70"
                    >
                      {/* Customer */}
                      <td className="px-9 py-4">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image || "/avatar.png"}
                              alt={user.name}
                              className="h-10 w-10 shrink-0 rounded-full object-cover"
                              width={500}
                              height={500}
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8DCCB] text-[#352A24]">
                              <User size={20} />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-semibold text-[#38291F]">
                              {user.name}
                            </p>
                            <p className="text-xs text-[#806F62]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-sm text-[#806F62]">
                        {user.phone || "Not provided"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                            user.isBlocked
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-[#806F62]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(user)}
                            className="rounded-lg bg-[#EDE0D3] p-2 text-[#80583D] transition hover:bg-[#E3D1BD]"
                            title="View Details"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            disabled={updating === user._id}
                            onClick={() => setUserToUpdate(user)}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.isBlocked
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                                : "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white"
                            }`}
                          >
                            {updating === user._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : user.isBlocked ? (
                              <CheckCircle size={14} />
                            ) : (
                              <Ban size={14} />
                            )}

                            <span>{user.isBlocked ? "Unblock" : "Block"}</span>
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

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#38291F]">
                Customer Details
              </h2>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
              <Image
                src={selected.image || "/avatar.png"}
                alt={selected.name}
                className="h-20 w-20 rounded-full object-cover"
                width={500}
                height={500}
              />
              <h3 className="mt-3 text-lg font-bold text-[#38291F]">
                {selected.name}
              </h3>
              <p className="text-sm text-[#806F62]">{selected.email}</p>
            </div>

            <div className="mt-6 space-y-3 text-sm text-[#806F62]">
              <p>Phone: {selected.phone || "Not provided"}</p>
              <p>Role: {selected.role}</p>
              <p>Status: {selected.isBlocked ? "Blocked" : "Active"}</p>
              <p>
                Joined:{" "}
                {selected.createdAt
                  ? new Date(selected.createdAt).toLocaleDateString()
                  : "Not available"}
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

      {/* Block / Unblock Confirmation Dialog */}
      <AlertDialog
        open={!!userToUpdate}
        onOpenChange={(open) => {
          if (!open && !updating) setUserToUpdate(null);
        }}
      >
        <AlertDialogContent className="max-w-[calc(100%-2rem)] rounded-2xl border-[#E9DED2] bg-white sm:max-w-md">
          <AlertDialogHeader>
            <div
              className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                userToUpdate?.isBlocked
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {userToUpdate?.isBlocked ? (
                <CheckCircle size={24} />
              ) : (
                <Ban size={24} />
              )}
            </div>

            <AlertDialogTitle className="text-xl font-bold text-[#38291F]">
              {userToUpdate?.isBlocked
                ? "Unblock Customer?"
                : "Block Customer?"}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm leading-relaxed text-[#806F62]">
              Are you sure you want to{" "}
              <span className="font-semibold text-[#38291F]">
                {userToUpdate?.isBlocked ? "unblock" : "block"}{" "}
                {userToUpdate?.name}
              </span>
              ?
              {userToUpdate?.isBlocked
                ? " This customer will be able to access their account again."
                : " This customer may lose access to their account."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex-row justify-end gap-2">
            <AlertDialogCancel
              disabled={!!updating}
              className="mt-0 border-[#E9DED2] text-[#806F62]"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={!!updating}
              onClick={(e) => {
                e.preventDefault();
                void handleBlock();
              }}
              className={`${
                userToUpdate?.isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {updating ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : null}
              {userToUpdate?.isBlocked ? "Unblock" : "Block"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
