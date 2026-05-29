"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatFees, formatRating } from "@/lib/format";

type CompareCollege = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  rating: number;
  annualFeesINR: number;
  overview: string;
  courses: Array<{ name: string; degree: string; feesINR: number }>;
  placements: Array<{
    year: number;
    avgPackageLPA: number;
    highestPackageLPA: number;
    placementPercent: number;
  }>;
};

export function CompareTable({ colleges }: { colleges: CompareCollege[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveComparison() {
    if (!session?.user) {
      router.push("/login?callbackUrl=/compare");
      return;
    }

    setSaving(true);
    setMessage("");
    const response = await fetch("/api/user/saved-comparisons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeIds: colleges.map((college) => college.id) }),
    });
    setSaving(false);

    if (response.ok) {
      setMessage("Comparison saved to your dashboard.");
    } else {
      const result = await response.json();
      setMessage(result.error ?? "Failed to save comparison");
    }
  }

  const rows = [
    {
      label: "Location",
      values: colleges.map((college) => `${college.city}, ${college.state}`),
    },
    {
      label: "Rating",
      values: colleges.map((college) => `${formatRating(college.rating)} / 5`),
    },
    {
      label: "Annual fees",
      values: colleges.map((college) => formatFees(college.annualFeesINR)),
    },
    {
      label: "Avg placement (LPA)",
      values: colleges.map(
        (college) =>
          college.placements[0]
            ? `₹${college.placements[0].avgPackageLPA} LPA`
            : "N/A",
      ),
    },
    {
      label: "Placement %",
      values: colleges.map((college) =>
        college.placements[0] ? `${college.placements[0].placementPercent}%` : "N/A",
      ),
    },
    {
      label: "Top course",
      values: colleges.map((college) =>
        college.courses[0]
          ? `${college.courses[0].name} (${college.courses[0].degree})`
          : "N/A",
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Metric</th>
              {colleges.map((college) => (
                <th key={college.id} className="px-4 py-3 text-left font-semibold text-slate-900">
                  {college.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-600">{row.label}</td>
                {row.values.map((value, index) => (
                  <td key={`${row.label}-${index}`} className="px-4 py-3 text-slate-800">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={saveComparison} disabled={saving}>
          {saving ? "Saving..." : "Save comparison"}
        </Button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </div>
    </div>
  );
}
