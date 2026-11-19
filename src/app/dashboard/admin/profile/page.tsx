"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { UserRound, Mail, Camera, Loader2, Save } from "lucide-react";
import Image from "next/image";
import { apiFetch } from "@/lib/api-fetch";

// const API_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function AdminProfilePage() {
  const { data: session, isPending } = useSession();

  const [name, setName] = useState(session?.user?.name || "");
  const [email] = useState(session?.user?.email || "");
  // const [phone, setPhone] = useState("");
  const [image, setImage] = useState(session?.user?.image || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please select JPG, PNG or WEBP image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be below 5MB");
      return;
    }

    if (!IMGBB_KEY) {
      toast.error("Image upload configuration is missing");
      return;
    }

    setUploading(true);

    try {
      const body = new FormData();
      body.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        { method: "POST", body },
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error("Image upload failed");
      }

      setImage(result.data.url);
      toast.success("Profile image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      const res = await apiFetch("/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          image,
          // phone: phone.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      toast.success(result.message || "Profile updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Profile update failed",
      );
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#80583D]" size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <div>
        <p className="text-sm font-medium text-[#A47754]">Account Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-[#38291F]">My Profile</h1>
        <p className="mt-2 text-sm text-[#806F62]">
          Manage your administrator account information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col items-center border-b border-[#E9DED2] pb-7">
          <div className="relative">
            <Image
              src={image || "/avatar.png"}
              alt="Admin profile"
              className="h-28 w-28 rounded-full border-4 border-[#EDE0D3] object-cover"
              width={500}
              height={500}
            />

            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#80583D] p-2.5 text-white shadow">
              {uploading ? (
                <Loader2 className="animate-spin" size={17} />
              ) : (
                <Camera size={17} />
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <h2 className="mt-4 text-xl font-bold text-[#38291F]">
            {name || "Admin"}
          </h2>
          <p className="mt-1 text-sm text-[#806F62]">SalonBook Administrator</p>
        </div>

        <div className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#38291F]">
              Full Name
            </label>

            <div className="relative">
              <UserRound
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18B78]"
                size={18}
              />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] py-3 pl-11 pr-4 outline-none focus:border-[#80583D]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#38291F]">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18B78]"
                size={18}
              />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-[#E9DED2] bg-gray-100 py-3 pl-11 pr-4 text-gray-500 outline-none"
              />
            </div>
          </div>

          {/* <div>
            <label className="mb-2 block text-sm font-semibold text-[#38291F]">
              Phone Number
            </label>

            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18B78]"
                size={18}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2] py-3 pl-11 pr-4 outline-none focus:border-[#80583D]"
              />
            </div>
          </div> */}

          <button
            type="submit"
            disabled={saving || uploading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#80583D] py-3.5 font-semibold text-white transition hover:bg-[#62432E] disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <Save size={19} />
            )}
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
}
