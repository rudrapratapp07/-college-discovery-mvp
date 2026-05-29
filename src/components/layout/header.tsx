import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Logo } from "@/components/layout/logo";

export async function Header() {
  const session = await auth();

  const linkClass =
    "rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-teal-800";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/colleges" className={linkClass}>
            Explore
          </Link>
          <Link href="/compare" className={linkClass}>
            Compare
          </Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className={linkClass}>
                My list
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className={`${linkClass} text-stone-500`}>
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass}>
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
