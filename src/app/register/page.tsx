import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
