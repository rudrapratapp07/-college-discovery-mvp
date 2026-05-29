"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompareTable } from "@/components/compare/compare-table";
import { EmptyState } from "@/components/ui/empty-state";

type CollegeOption = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
};

export function ComparePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<CollegeOption[]>([]);
  const [selected, setSelected] = useState<CollegeOption[]>([]);
  const [compareData, setCompareData] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ids = searchParams.get("ids");
    if (ids) {
      fetch(`/api/colleges/compare?ids=${ids}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.data?.colleges) {
            setCompareData(result.data.colleges);
            setSelected(result.data.colleges);
          }
        });
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.length < 2) {
        setOptions([]);
        return;
      }
      const response = await fetch(`/api/colleges?q=${encodeURIComponent(search)}&limit=8`);
      const result = await response.json();
      setOptions(result.data?.colleges ?? []);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  function addCollege(college: CollegeOption) {
    if (selected.find((item) => item.id === college.id)) return;
    if (selected.length >= 3) {
      setError("You can compare up to 3 colleges");
      return;
    }
    setError("");
    setSelected((prev) => [...prev, college]);
    setSearch("");
    setOptions([]);
  }

  function removeCollege(id: string) {
    setSelected((prev) => prev.filter((college) => college.id !== id));
    setCompareData(null);
  }

  async function runCompare() {
    if (selected.length < 2) {
      setError("Select at least 2 colleges to compare");
      return;
    }
    setLoading(true);
    setError("");
    const ids = selected.map((college) => college.id).join(",");
    router.push(`/compare?ids=${ids}`);
    const response = await fetch(`/api/colleges/compare?ids=${ids}`);
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.error ?? "Compare failed");
      return;
    }
    setCompareData(result.data.colleges);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Select colleges</h2>
        <p className="mt-1 text-sm text-slate-500">Choose 2 to 3 colleges for side-by-side comparison.</p>
        <div className="mt-4 space-y-3">
          <Input
            placeholder="Search college by name or city..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {options.length > 0 && (
            <ul className="rounded-lg border border-slate-200">
              {options.map((college) => (
                <li key={college.id}>
                  <button
                    type="button"
                    onClick={() => addCollege(college)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    <span>{college.name}</span>
                    <span className="text-slate-500">
                      {college.city}, {college.state}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selected.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selected.map((college) => (
              <span
                key={college.id}
                className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-800"
              >
                {college.name}
                <button type="button" onClick={() => removeCollege(college.id)} aria-label="Remove">
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <Button className="mt-4" onClick={runCompare} disabled={loading}>
          {loading ? "Comparing..." : "Compare now"}
        </Button>
      </div>

      {compareData && compareData.length >= 2 ? (
        <CompareTable colleges={compareData as Parameters<typeof CompareTable>[0]["colleges"]} />
      ) : (
        <EmptyState
          title="No comparison yet"
          description="Search and select colleges above, then click Compare now."
        />
      )}
    </div>
  );
}
