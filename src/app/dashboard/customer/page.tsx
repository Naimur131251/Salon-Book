import Link from "next/link";
import { CalendarDays, Scissors, ArrowRight } from "lucide-react";
export const instant = false;

export default function CustomerDashboard() {
  return (
    <div>
      <div>
        <p className="text-sm font-medium text-[#A47754]">
          Welcome to SalonBook
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#38291F]">
          Customer Dashboard
        </h1>

        <p className="mt-2 text-sm text-[#806F62]">
          Manage your appointments and enjoy our salon services.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDE0D3] text-[#80583D]">
            <CalendarDays size={23} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#38291F]">
            My Appointments
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#806F62]">
            View and manage your salon appointment requests.
          </p>

          <Link
            href="/dashboard/customer/appointments"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#80583D] hover:text-[#62432E]"
          >
            View Appointments
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDE0D3] text-[#80583D]">
            <Scissors size={23} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-[#38291F]">
            Explore Services
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#806F62]">
            Discover professional salon services and book your next visit.
          </p>

          <Link
            href="/services"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#80583D] hover:text-[#62432E]"
          >
            Browse Services
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
