"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // রিডাইরেক্ট করার জন্য
import { authClient } from "@/lib/auth-client"; // আপনার authClient ফাইলের সঠিক পাথ দিন
import {
  Scissors,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Camera,
  ImagePlus,
  X,
  Check,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageType, setImageType] = useState<"upload" | "url">("upload");

  // ফর্মের ইনপুট স্টেটগুলো
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const passwordRules = [
    {
      label: "At least 8 characters", // Better Auth ডিফল্টভাবে ৮ অক্ষর চায়
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
  ];

  const handleImageUpload = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", {
        description: "Please select a valid image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", {
        description: "Image size must be less than 5MB.",
      });
      return;
    }

    setPreview(URL.createObjectURL(file));
    toast.success("Image Selected", {
      description: "Profile photo preview updated.",
    });
  };

  const handleImageUrl = (url: string) => {
    setImageUrl(url);
    setPreview(url);
  };

  // ফর্ম সাবমিট ফাংশন
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // পাসওয়ার্ড রুলস চেক
    if (password.length < 8) {
      toast.error("Weak Password", {
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    // পাসওয়ার্ড ম্যাচিং চেক
    if (confirmPassword && password !== confirmPassword) {
      toast.error("Password Mismatch", {
        description: "Passwords do not match. Please check again.",
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: imageType === "url" && imageUrl ? imageUrl : undefined,
        callbackURL: callbackUrl,
      });

      if (error) {
        toast.error("Registration Failed", {
          description: error.message || "Could not create your account.",
        });
        setLoading(false);
        return;
      }

      toast.success("Account Created!", {
        description: "Welcome to Salon Book! Redirecting...",
      });

      router.push("/");
    } catch (err) {
      console.error("Unexpected Error:", err);
      toast.error("Something Went Wrong", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Registration
  const handleGoogleRegister = async () => {
    try {
      setLoading(true);

      toast.info("Signing in...", {
        description: "Redirecting you to Google authentication.",
      });

      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (err) {
      console.error("Google login error:", err);
      setLoading(false);

      toast.error("Login Failed", {
        description: "Could not authenticate with Google.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F3EB] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        {/* Left Side */}
        <div className="relative hidden min-h-full lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200')",
            }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#211914]/90 via-[#352A24]/30 to-transparent" />

          <Link
            href="/"
            className="absolute left-10 top-10 flex items-center gap-2 text-2xl font-bold text-white"
          >
            <Scissors size={28} className="text-[#D9B98B]" />
            Salon<span className="text-[#D9B98B]">Book</span>
          </Link>

          <div className="absolute bottom-12 left-10 right-10">
            <div className="mb-4 flex items-center gap-2 text-[#D9B98B]">
              <Sparkles size={18} />
              <span className="text-xs font-semibold tracking-[3px]">
                YOUR BEAUTY JOURNEY STARTS HERE
              </span>
            </div>

            <h1 className="font-serif text-4xl font-semibold leading-tight text-white xl:text-5xl">
              Beauty is not just a look,
              <span className="block italic text-[#D9B98B]">
                it&apos;s an experience.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#E8DCCB]">
              Join SalonBook and discover your favorite salon services. Your
              perfect beauty experience is just one step away.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-8 flex items-center gap-2 text-2xl font-bold text-[#352A24] lg:hidden"
            >
              <Scissors size={27} className="text-[#B89B7A]" />
              Salon<span className="text-[#B89B7A]">Book</span>
            </Link>

            <div className="mb-7">
              <p className="mb-3 text-xs font-semibold tracking-[3px] text-[#B89B7A]">
                CREATE YOUR ACCOUNT
              </p>

              <h2 className="font-serif text-3xl font-semibold text-[#352A24] sm:text-4xl">
                Join SalonBook
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#8B796A]">
                Create your account and enjoy a personalized beauty experience.
              </p>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#E8DCCB] bg-white py-3.5 text-sm font-semibold text-[#352A24] transition hover:bg-[#F8F3EB] cursor-pointer"
            >
              {/* <Chrome size={19} className="text-[#765B46]" /> */}
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E8DCCB]" />
              <span className="text-xs text-[#A99989]">
                OR REGISTER WITH EMAIL
              </span>
              <div className="h-px flex-1 bg-[#E8DCCB]" />
            </div>

            {/* Registration Form */}
            <form className="space-y-5" onSubmit={handleSignUp}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#352A24]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B89B7A]"
                  />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className="w-full rounded-xl border border-[#E8DCCB] bg-[#FDFBF8] py-3.5 pl-11 pr-4 text-sm text-[#352A24] outline-none transition placeholder:text-[#B6A99B] focus:border-[#B89B7A] focus:ring-2 focus:ring-[#B89B7A]/20"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#352A24]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B89B7A]"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#E8DCCB] bg-[#FDFBF8] py-3.5 pl-11 pr-4 text-sm text-[#352A24] outline-none transition placeholder:text-[#B6A99B] focus:border-[#B89B7A] focus:ring-2 focus:ring-[#B89B7A]/20"
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#352A24]">
                  Profile Image
                  <span className="ml-1 font-normal text-[#A99989]">
                    (Optional)
                  </span>
                </label>

                <div className="rounded-xl border border-[#E8DCCB] bg-[#FDFBF8] p-4">
                  <div className="mb-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setImageType("upload")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${
                        imageType === "upload"
                          ? "bg-[#352A24] text-white"
                          : "bg-[#E8DCCB]/50 text-[#765B46]"
                      }`}
                    >
                      <ImagePlus size={16} />
                      Upload Image
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageType("url")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${
                        imageType === "url"
                          ? "bg-[#352A24] text-white"
                          : "bg-[#E8DCCB]/50 text-[#765B46]"
                      }`}
                    >
                      <Camera size={16} />
                      Image URL
                    </button>
                  </div>

                  {imageType === "upload" ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleImageUpload(e.dataTransfer.files[0]);
                      }}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#D9C3A5] px-4 py-6 text-center transition hover:bg-[#F8F3EB]"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files?.[0])}
                      />

                      {preview && imageType === "upload" ? (
                        <Image
                          src={preview}
                          alt="Profile preview"
                          className="h-16 w-16 rounded-full object-cover"
                          width={500}
                          height={500}
                        />
                      ) : (
                        <ImagePlus size={28} className="mb-2 text-[#B89B7A]" />
                      )}

                      <p className="text-sm font-medium text-[#765B46]">
                        Click to upload or drag an image
                      </p>
                      <p className="mt-1 text-xs text-[#A99989]">
                        PNG, JPG or WEBP · Maximum 5MB
                      </p>
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => handleImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full rounded-lg border border-[#E8DCCB] bg-white px-4 py-3 text-sm text-[#352A24] outline-none placeholder:text-[#B6A99B] focus:border-[#B89B7A]"
                    />
                  )}

                  {preview && imageType === "url" && (
                    <div className="mt-3 flex items-center gap-3">
                      <Image
                        src={preview}
                        alt="Profile preview"
                        className="h-12 w-12 rounded-full object-cover"
                        onError={() => setPreview("")}
                        width={500}
                        height={500}
                      />
                      <span className="text-xs text-[#765B46]">
                        Image preview
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPreview("");
                          setImageUrl("");
                        }}
                        aria-label="Remove image"
                        className="ml-auto text-[#9A7660] hover:text-red-500"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#352A24]"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B89B7A]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#E8DCCB] bg-[#FDFBF8] py-3.5 pl-11 pr-12 text-sm text-[#352A24] outline-none transition placeholder:text-[#B6A99B] focus:border-[#B89B7A] focus:ring-2 focus:ring-[#B89B7A]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B89B7A] cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Rules */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-2">
                      {rule.valid ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <span className="h-3.5 w-3.5 rounded-full border border-[#C9B9A8]" />
                      )}
                      <span
                        className={`text-xs ${rule.valid ? "text-green-700" : "text-[#9A8A7B]"}`}
                      >
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#352A24]"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B89B7A]"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#E8DCCB] bg-[#FDFBF8] py-3.5 pl-11 pr-12 text-sm text-[#352A24] outline-none transition placeholder:text-[#B6A99B] focus:border-[#B89B7A] focus:ring-2 focus:ring-[#B89B7A]/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B89B7A] cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 accent-[#765B46] cursor-pointer"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-[#8B796A]"
                >
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="font-semibold text-[#765B46] underline"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="font-semibold text-[#765B46] underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#352A24] py-4 text-sm font-semibold text-white transition hover:bg-[#765B46] cursor-pointer"
              >
                Create Account
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              {/* Security Note */}
              <p className="text-center text-xs leading-5 text-[#9A8A7B]">
                <Lock size={12} className="mr-1 inline" />
                Public registration is for customer accounts only.
              </p>
            </form>

            {/* Login */}
            <p className="mt-6 text-center text-sm text-[#8B796A]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#765B46] transition hover:text-[#B89B7A]"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
