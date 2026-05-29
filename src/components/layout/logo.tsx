import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-teal-500 text-sm font-extrabold text-white shadow-md shadow-teal-700/25 transition group-hover:scale-105">
        E
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-bold tracking-tight text-stone-900">EduFind</span>
        <span className="hidden text-[10px] font-medium uppercase tracking-wider text-stone-500 sm:block">
          College discovery
        </span>
      </span>
    </Link>
  );
}
