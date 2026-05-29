import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { listColleges } from "@/lib/colleges";
import { CollegeCard } from "@/components/colleges/college-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ colleges }, totalColleges, stateCount] = await Promise.all([
    listColleges({ sort: "rating", order: "desc", limit: "6", page: "1" }),
    prisma.college.count(),
    prisma.college.findMany({ distinct: ["state"], select: { state: true } }),
  ]);

  return (
    <>
      <section className="hero-pattern relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="inline-flex items-center rounded-full border border-teal-400/30 bg-teal-800/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-100">
              Made for students · India
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Choose your college with clarity, not confusion
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-teal-100/90">
              EduFind helps you search {totalColleges}+ institutions across {stateCount.length}{" "}
              states, compare fees and placements side-by-side, and save a shortlist you can revisit
              anytime.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/colleges"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-teal-900 shadow-lg transition hover:bg-teal-50"
              >
                Start exploring
              </Link>
              <Link
                href="/compare"
                className="rounded-xl border-2 border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Compare colleges
              </Link>
            </div>
          </div>
          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/20 pt-10 sm:max-w-lg">
            <div>
              <dt className="text-sm text-teal-200">Colleges</dt>
              <dd className="mt-1 text-2xl font-bold">{totalColleges}+</dd>
            </div>
            <div>
              <dt className="text-sm text-teal-200">States</dt>
              <dd className="mt-1 text-2xl font-bold">{stateCount.length}</dd>
            </div>
            <div>
              <dt className="text-sm text-teal-200">Compare up to</dt>
              <dd className="mt-1 text-2xl font-bold">3</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-bold uppercase tracking-wider text-teal-700">
          How it works
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Search & filter",
              desc: "Narrow by state, fees, and rating to find colleges that match your goals.",
            },
            {
              step: "02",
              title: "Deep dive",
              desc: "Read courses, placement stats, and student reviews on each profile.",
            },
            {
              step: "03",
              title: "Compare & save",
              desc: "Line up 2–3 options, compare metrics, and save your shortlist to your account.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <span className="text-3xl font-extrabold text-teal-100">{item.step}</span>
              <h3 className="mt-2 text-lg font-bold text-stone-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Top rated picks</h2>
              <p className="mt-1 text-stone-600">Highly rated institutions students explore first.</p>
            </div>
            <Link href="/colleges" className="text-sm font-semibold text-teal-700 hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
