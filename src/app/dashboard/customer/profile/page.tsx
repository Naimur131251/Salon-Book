"use client";

import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { UserRound, Mail, Camera, Save, Loader2 } from "lucide-react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function CustomerProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="animate-spin text-[#80583D]" size={32} />
      </div>
    );
  }

  if (!session?.user) {
    return <p className="p-8">Please sign in first.</p>;
  }

  return <CustomerProfileForm key={session.user.id} user={session.user} />;
}

function CustomerProfileForm({
  user,
}: {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  const [name, setName] = useState(user.name || "");
  const [email] = useState(user.email || "");
  const [image, setImage] = useState(user.image || "");
//   const [phone, setPhone] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.error("Image upload configuration is missing");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error("Image upload failed");
      }

      setImage(result.data.url);
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

    try {
      setSaving(true);

      const res = await fetch(`${API}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: user.id,
          name,
          image,
        //   phone,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);
      await authClient.updateUser({
        name: name.trim(),
        image,
      });

      toast.success(result.message || "Profile updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Profile update failed",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      <div>
        <h1 className="text-3xl font-bold text-[#38291F]">My Profile</h1>
        <p className="mt-2 text-[#806F62]">Update your personal information.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col items-center border-b border-[#E9DED2] pb-7">
          <div className="relative">
            <Image
              src={image || "/avatar.png"}
              alt="Profile"
              className="h-28 w-28 rounded-full border-4 border-[#EDE0D3] object-cover"
              width={500}
              height={500}
            />

            <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#80583D] p-2.5 text-white">
              {uploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Camera size={18} />
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

          <h2 className="mt-4 text-xl font-bold text-[#38291F]">{name}</h2>
          <p className="text-sm text-[#806F62]">{email}</p>
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
                className="w-full rounded-xl border border-[#E9DED2] bg-gray-100 py-3 pl-11 pr-4 text-gray-500 outline-none"
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
