import {
  Award,
  CalendarCheck,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Expert Professionals",
    description:
      "Get exceptional beauty care from skilled and experienced salon professionals who understand your needs.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Online Booking",
    description:
      "Book your favorite salon services anytime, anywhere with a simple and hassle-free booking experience.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Enjoy a safe and reliable payment experience with secure online transactions through Stripe.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Care",
    description:
      "Every customer is special. We focus on your preferences to make every salon visit comfortable.",
  },
];

const benefits = [
  "Simple appointment scheduling",
  "Transparent service pricing",
  "Convenient appointment management",
  "Quality-focused beauty services",
];

export default function WhyChooseUs() {
  return (
    <section className="overflow-hidden bg-[#FAF7F2] px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* Left Content */}
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[3px] text-[#A47754]">
            <Sparkles size={17} />
            The SalonBook Experience
          </span>

          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-[#352A24] md:text-5xl">
            Your Beauty, Our
            <span className="block text-[#80583D]">Priority.</span>
          </h2>

          <p className="mt-6 max-w-lg text-sm leading-8 text-[#7A6859] sm:text-base">
            We believe self-care should be simple, comfortable, and accessible.
            SalonBook makes discovering beauty services and booking your next
            appointment easier than ever.
          </p>

          {/* Benefits */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 text-sm font-medium text-[#4A3B32]"
              >
                <CheckCircle2 size={19} className="shrink-0 text-[#80583D]" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Right Feature Cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[#E6D9C8] bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#B89B7A] hover:shadow-md"
              >
                <div className="mb-6 inline-flex rounded-xl bg-[#F8F3EB] p-4 text-[#80583D] transition duration-300 group-hover:bg-[#80583D] group-hover:text-white">
                  <Icon size={26} />
                </div>

                <h3 className="font-serif text-lg font-bold text-[#352A24]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#7A6859]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
