import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Taxi from "./Icons/Taxi";
import { business, navLinks } from "../utils/business";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-ink text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Taxi className="h-8 w-8 text-brand" />
          <span>
            STAR <span className="text-brand">CABS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-brand ${
                router.pathname === link.href ? "text-brand" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={`tel:${business.phones.primary}`}
          className="hidden rounded-md bg-brand px-4 py-2 text-sm font-bold text-ink transition hover:bg-brand-dark md:inline-block"
        >
          Call {business.phones.primary}
        </a>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <span className="block h-0.5 w-6 bg-white" />
          <span className="my-1.5 block h-0.5 w-6 bg-white" />
          <span className="block h-0.5 w-6 bg-white" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium ${
                router.pathname === link.href ? "text-brand" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${business.phones.primary}`}
            className="rounded-md bg-brand px-4 py-2 text-center text-sm font-bold text-ink"
          >
            Call {business.phones.primary}
          </a>
        </nav>
      )}
    </header>
  );
}
