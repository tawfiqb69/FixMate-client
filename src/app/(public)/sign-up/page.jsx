"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell from "@/components/auth-shell";

const roles = [
  { value: "customer", hint: "I need a repair" },
  { value: "technician", hint: "I offer repair services" },
];

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
    <AuthShell
      title="Create your account"
      subtitle="Join FixMate as a customer or a technician."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password ? (
            <p className="text-sm text-destructive">{errors.password}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              At least 6 characters, with one uppercase and one lowercase letter.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>I want to join as</Label>
          <div className="grid grid-cols-2 gap-3">
            {roles.map(({ value, hint }) => (
              <label
                key={value}
                className={`cursor-pointer rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                  form.role === value
                    ? "border-primary bg-accent"
                    : "hover:border-primary/40"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={value}
                  checked={form.role === value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="flex items-center justify-between">
                  <span className="font-semibold capitalize">{value}</span>
                  {form.role === value && <Check className="size-4 text-primary" />}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {hint}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-10 w-full bg-brand-gradient text-white hover:opacity-90"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </AuthShell>
  );
}