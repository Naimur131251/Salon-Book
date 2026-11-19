import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />

        <h1 className="text-3xl font-bold">Payment Successful!</h1>

        <p className="text-muted-foreground">
          Your payment was submitted successfully. Your transaction is being
          verified.
        </p>

        <Link
          href="/dashboard/appointments"
          className="inline-flex px-6 py-3 rounded-lg bg-primary text-primary-foreground"
        >
          View My Appointments
        </Link>
      </div>
    </main>
  );
}
