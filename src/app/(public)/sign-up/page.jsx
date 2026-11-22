"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import AuthShell from "@/components/auth-shell";
import GoogleButton from "@/components/google-button";

const roles = [
  { value: "customer", hint: "I need a repair" },
  { value: "technician", hint: "I offer repair services" },
];

const labelClass =
  "font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground";
const inputClass =
  "h-11 rounded-xl pl-10 transition-shadow focus-visible:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_15%,transparent)]";

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
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Role first: it decides what the account can do */}
          <fieldset className="space-y-2">
            <legend className={labelClass}>I want to join as</legend>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(({ value, hint }) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring ${
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
                    <span className="text-sm font-semibold capitalize">{value}</span>
                    {form.role === value && <Check className="size-4 text-primary" />}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {hint}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="name" className={labelClass}>Full name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={inputClass}
              />
            </div>
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className={labelClass}>Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClass}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className={labelClass}>Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                aria-describedby="password-help"
                className={inputClass + " pr-11"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password ? (
              <p id="password-help" className="text-sm text-destructive">{errors.password}</p>
            ) : (
              <p id="password-help" className="text-xs text-muted-foreground">
                At least 6 characters, with one uppercase and one lowercase letter.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-medium text-white shadow-[0_10px_24px_-12px_#047857] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Sign Up
                <ArrowRight className="size-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            or continue with
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {form.role === "customer" ? (
          <GoogleButton
            callbackURL="/dashboard/customer"
            errorCallbackURL="/sign-up"
            label="Sign up with Google"
          />
        ) : (
          <p className="rounded-xl border border-dashed p-3.5 text-center text-sm text-muted-foreground">
            Google sign-up creates a customer account. To join as a technician,
            please sign up with your email above.
          </p>
        )}
      </div>
    </AuthShell>
  );
}