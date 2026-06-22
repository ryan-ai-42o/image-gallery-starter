import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Wordmark from "./Icons/Wordmark";
import { business, navLinks } from "../utils/business";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b bg-white text-ink shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center">
          <Wordmark className="h-10" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-brand ${
                router.pathname === link.href ? "text-brand" : "text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={`tel:${business.phones.primary}`}
          className="hidden rounded-md bg-brand px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-dark md:inline-block"
        >
          Call {business.phones.primary}
        </a>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="my-1.5 block h-0.5 w-6 bg-ink" />
          <span className="block h-0.5 w-6 bg-ink" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t px-4 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium ${
                router.pathname === link.href ? "text-brand" : "text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${business.phones.primary}`}
            className="rounded-md bg-brand px-4 py-2 text-center text-sm font-bold text-white"
          >
            Call {business.phones.primary}
          </a>
        </nav>
      )}
    </header>
  );
}
