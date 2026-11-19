"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function validate({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email.";
  if (!password) errors.password = "Password is required.";
  return errors;
}

// Only allow redirects inside our own site (blocks "//evil.com" and "https://...").
function safeRedirect(value) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return null;
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const { data, error } = await authClient.signIn.email({
      email: form.email.trim(),
      password: form.password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Invalid email or password.");
      return;
    }

    toast.success("Signed in!");
    const role = data?.user?.role || "customer";
    const target = safeRedirect(searchParams.get("redirect")) || `/dashboard/${role}`;
    router.push(target);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Sign in to FixMate</h1>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-4 text-sm">
        New here? <Link href="/sign-up" className="underline">Create an account</Link>
      </p>
    </main>
  );
}

// useSearchParams needs a Suspense wrapper in Next.js.
export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}