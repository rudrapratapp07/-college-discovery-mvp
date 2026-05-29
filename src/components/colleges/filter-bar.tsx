"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type FilterBarProps = {
  states: string[];
};

export function FilterBar({ states }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      params.set("page", "1");
      startTransition(() => {
        router.push(`/colleges?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  return (
    <form
      className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2 lg:grid-cols-6"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        updateParams({
          q: String(formData.get("q") ?? ""),
          state: String(formData.get("state") ?? ""),
          minFees: String(formData.get("minFees") ?? ""),
          maxFees: String(formData.get("maxFees") ?? ""),
          minRating: String(formData.get("minRating") ?? ""),
          sort: String(formData.get("sort") ?? "rating"),
          order: String(formData.get("order") ?? "desc"),
        });
      }}
    >
      <Input
        name="q"
        placeholder="Search colleges..."
        defaultValue={searchParams.get("q") ?? ""}
        className="lg:col-span-2"
      />
      <Select name="state" defaultValue={searchParams.get("state") ?? ""}>
        <option value="">All states</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </Select>
      <Input
        name="minFees"
        type="number"
        placeholder="Min fees"
        defaultValue={searchParams.get("minFees") ?? ""}
      />
      <Input
        name="maxFees"
        type="number"
        placeholder="Max fees"
        defaultValue={searchParams.get("maxFees") ?? ""}
      />
      <Input
        name="minRating"
        type="number"
        step="0.1"
        min="0"
        max="5"
        placeholder="Min rating"
        defaultValue={searchParams.get("minRating") ?? ""}
      />
      <Select name="sort" defaultValue={searchParams.get("sort") ?? "rating"}>
        <option value="rating">Sort: Rating</option>
        <option value="fees">Sort: Fees</option>
        <option value="name">Sort: Name</option>
      </Select>
      <Select name="order" defaultValue={searchParams.get("order") ?? "desc"}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </Select>
      <Button type="submit" disabled={isPending} className="lg:col-span-2">
        {isPending ? "Applying..." : "Apply filters"}
      </Button>
    </form>
  );
}
