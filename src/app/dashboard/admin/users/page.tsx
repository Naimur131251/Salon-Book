"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

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

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/admin/users`, {
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

  const handleBlock = async (user: IUser) => {
    const newStatus = !user.isBlocked;

    if (
      !window.confirm(
        `Are you sure you want to ${newStatus ? "block" : "unblock"} ${user.name}?`,
      )
    )
      return;

    try {
      setUpdating(user._id);

      const res = await fetch(`${API_URL}/admin/users/${user._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // credentials: "include",
        body: JSON.stringify({ isBlocked: newStatus }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success(result.message || "User status updated");
      await fetchUsers();

      if (selected?._id === user._id) {
        setSelected({ ...user, isBlocked: newStatus });
      }
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
          <div className="overflow-x-auto">
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
                  <tr key={user._id}>
                    <td className="px-9 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.image || "/avatar.png"}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                          width={500}
                          height={500}
                        />
                        <div>
                          <p className="font-semibold text-[#38291F]">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#806F62]">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#806F62]">
                      {user.phone || "Not provided"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          user.isBlocked
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#806F62]">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(user)}
                          className="rounded-lg bg-[#EDE0D3] p-2 text-[#80583D]"
                          title="View details"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          disabled={updating === user._id}
                          onClick={() => handleBlock(user)}
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
    </div>
  );
}
