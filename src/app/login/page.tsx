import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-slate-100" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
