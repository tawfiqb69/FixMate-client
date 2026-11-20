"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function validate({ name, email, password }) {
  const errors = {};
  if (!name.trim()) errors.name = "Full name is required.";
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < 6) errors.password = "At least 6 characters.";
  else if (!/[A-Z]/.test(password)) errors.password = "Add one uppercase letter.";
  else if (!/[a-z]/.test(password)) errors.password = "Add one lowercase letter.";
  return errors;
}

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
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
    const { data, error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Sign up failed.");
      return;
    }

    toast.success("Account created!");
    const role = data?.user?.role || "customer";
    router.push(`/dashboard/${role}`);
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Create your account</h1>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

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

        <div className="space-y-1">
          <Label>I want to join as</Label>
          <div className="grid grid-cols-2 gap-3">
            {["customer", "technician"].map((r) => (
              <label
                key={r}
                className={`cursor-pointer rounded-lg border p-3 text-center capitalize ${
                  form.role === r ? "border-black font-semibold" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={r}
                  checked={form.role === r}
                  onChange={handleChange}
                  className="sr-only"
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account? <Link href="/sign-in" className="underline">Sign In</Link>
      </p>
    </main>
  );
}