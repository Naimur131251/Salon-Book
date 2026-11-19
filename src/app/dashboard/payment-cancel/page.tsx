import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <XCircle className="w-20 h-20 text-red-500 mx-auto" />

        <h1 className="text-3xl font-bold">Payment Cancelled</h1>

        <p className="text-muted-foreground">
          Your payment was cancelled. You can try again from your appointments
          page.
        </p>

        <Link
          href="/dashboard/appointments"
          className="inline-flex px-6 py-3 rounded-lg bg-primary text-primary-foreground"
        >
          Back to Appointments
        </Link>
      </div>
    </main>
  );
}
