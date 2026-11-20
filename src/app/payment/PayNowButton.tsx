"use client";

// import { useState } from "react";
import { toast } from "sonner";
// import { Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/get-token";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface PayNowButtonProps {
  appointmentId: string;
  paymentStatus: string;
  appointmentStatus: string;
}

export default function PayNowButton({
  appointmentId,
  paymentStatus,
  appointmentStatus,
}: PayNowButtonProps) {
//   const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
    //   setLoading(true);

      const token = await getToken();

      if (!token) {
        toast.error("Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create checkout session");
      }

      if (!result.url) {
        throw new Error("Stripe checkout URL not found.");
      }

      window.location.href = result.url;
    } catch (error) {
      console.error("Payment error:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
    //   setLoading(false);
    }
  };

  if (paymentStatus === "paid" || appointmentStatus !== "confirmed") {
    return null;
  }

  return (
    <Button onClick={handlePayment} className="gap-2">
      {/* {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )} */}

      {"Pay Now"}
    </Button>
  );
}
