import Link from "next/link";
import { business, navLinks } from "../utils/business";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">
            {business.name}
          </h3>
          <p className="text-sm">{business.tagline}</p>
          <p className="mt-3 text-sm">
            {business.address.street}
            <br />
            {business.address.city}, {business.address.state}{" "}
            {business.address.zip}
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-bold text-white">Contact</h3>
          <p className="text-sm">
            <a href={`tel:${business.phones.primary}`} className="hover:text-brand-light">
              {business.phones.primary}
            </a>
          </p>
          <p className="text-sm">
            <a href={`tel:${business.phones.secondary}`} className="hover:text-brand-light">
              {business.phones.secondary}
            </a>
          </p>
          <p className="text-sm">
            Toll-free:{" "}
            <a href={`tel:${business.phones.tollFree}`} className="hover:text-brand-light">
              {business.phones.tollFree}
            </a>
          </p>
          <p className="mt-2 text-sm">
            <a href={`mailto:${business.email}`} className="hover:text-brand-light">
              {business.email}
            </a>
          </p>
          <p className="mt-2 text-sm">{business.hours}</p>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-bold text-white">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        Star Cabs maintains a zero-tolerance policy on drugs and alcohol for
        all drivers. Report concerns to {business.zeroTolerancePhone} or{" "}
        {business.email}.
        <br />
        &copy; {new Date().getFullYear()} {business.name}. All rights
        reserved.
      </div>
    </footer>
  );
}
