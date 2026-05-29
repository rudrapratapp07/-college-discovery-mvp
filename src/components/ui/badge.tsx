import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "rating";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "rating"
          ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200/80"
          : "bg-teal-50 text-teal-800 ring-1 ring-teal-200/80",
        className,
      )}
    >
      {children}
    </span>
  );
}
