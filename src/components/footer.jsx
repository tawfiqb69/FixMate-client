import Link from "next/link";
import { ArrowUpRight, Lock, Mail, MapPin, Phone, Wrench } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
];

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

function XIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socials = [
  { label: "X", href: "https://x.com", Icon: XIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinIcon },
];

const headingClass =
  "font-mono text-[11px] uppercase tracking-[0.18em] text-white/50";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#06241B]";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-[#06241B] to-[#041A13] text-white">
      {/* thin light along the top edge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/60 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* Brand + about */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href="/"
              className={`inline-flex items-center gap-3 rounded-full ${focusRing}`}
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-brand-gradient text-white ring-1 ring-white/25">
                <Wrench className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-4xl font-bold tracking-tight">
                <span className="text-white">Fix</span>
                <span className="text-emerald-400">Mate</span>
              </span>
            </Link>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-300">
              Repair &middot; Track &middot; Pay after service
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              FixMate connects people with admin-approved technicians for
              phones, laptops and home appliances. Every repair has a status you
              can follow, and you pay only after the work is done.
            </p>

            <div className="mt-7 flex items-center gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex size-11 items-center justify-center rounded-full border border-white/20 text-white/75 transition-all hover:border-emerald-300/60 hover:bg-white/10 hover:text-white motion-safe:hover:-translate-y-0.5 ${focusRing}`}
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links" className="lg:col-span-2">
            <h3 className={headingClass}>Explore</h3>
            <ul className="mt-6 space-y-3.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group inline-flex items-center gap-1.5 rounded text-white/70 transition-colors hover:text-white ${focusRing}`}
                  >
                    {link.label}
                    <ArrowUpRight
                      className="size-3.5 -translate-x-1 text-emerald-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories as chips */}
          <nav aria-label="Popular categories" className="lg:col-span-3">
            <h3 className={headingClass}>Popular categories</h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className={`inline-flex rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-white/80 transition-colors hover:border-emerald-300/50 hover:bg-white/15 hover:text-white ${focusRing}`}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact card */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className={headingClass}>Contact</h3>
            <ul className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                  <Mail className="size-4" aria-hidden="true" />
                </span>
                <a
                  href="mailto:support@fixmate.com"
                  className={`min-w-0 break-all rounded text-white/80 transition-colors hover:text-white ${focusRing}`}
                >
                  support@fixmate.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                  <Phone className="size-4" aria-hidden="true" />
                </span>
                <a
                  href="tel:+8801700000000"
                  className={`rounded text-white/80 transition-colors hover:text-white ${focusRing}`}
                >
                  +880 1700-000000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-emerald-300">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <span className="pt-0.5 leading-snug text-white/80">
                  House 12, Road 5, Dhanmondi, Dhaka 1205
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-white/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            <Lock className="size-3.5 text-emerald-300" aria-hidden="true" />
            Card payments are handled by Stripe Checkout
          </p>
        </div>
      </div>

      {/* oversized wordmark that fades out, decoration only */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[22vw] font-bold leading-[0.8] tracking-tight text-white/[0.07] lg:text-[16rem]"
        style={{
          maskImage: "linear-gradient(to bottom, black 25%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 25%, transparent 95%)",
        }}
      >
        FixMate
      </p>
    </footer>
  );
}
