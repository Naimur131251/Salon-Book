import { CalendarDays, Scissors, Users, CreditCard } from "lucide-react";

const stats = [
  {
    title: "Total Services",
    value: "21",
    icon: Scissors,
  },
  {
    title: "Appointments",
    value: "120",
    icon: CalendarDays,
  },
  {
    title: "Total Users",
    value: "85",
    icon: Users,
  },
  {
    title: "Transactions",
    value: "৳45,000",
    icon: CreditCard,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div>
        <p className="text-sm font-medium text-[#A47754]">
          Welcome Back, Admin
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#38291F]">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-sm text-[#806F62]">
          Manage your salon services, appointments and customers.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#806F62]">{stat.title}</p>

                <div className="rounded-xl bg-[#EDE0D3] p-3 text-[#80583D]">
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-5 text-3xl font-bold text-[#38291F]">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
