import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-stone-500">
              A student-first platform to explore colleges, compare outcomes, and build your
              shortlist — one place, zero guesswork.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="font-semibold text-stone-800">Explore</p>
              <ul className="mt-3 space-y-2 text-stone-500">
                <li>
                  <Link href="/colleges" className="hover:text-teal-700">
                    All colleges
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="hover:text-teal-700">
                    Compare tool
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-stone-800">Account</p>
              <ul className="mt-3 space-y-2 text-stone-500">
                <li>
                  <Link href="/register" className="hover:text-teal-700">
                    Create account
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-teal-700">
                    Saved colleges
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-stone-100 pt-6 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} EduFind. Built as a college discovery MVP.
        </p>
      </div>
    </footer>
  );
}
