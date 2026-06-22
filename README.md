# Star Cabs of Metairie

A marketing website for Star Cabs, a 24-hour taxi and airport transportation
service based in Metairie, LA, built with Next.js and Tailwind CSS.

## Pages

- `/` — Home page with an overview of services and a call-to-action
- `/services` — Detailed service descriptions
- `/rates` — Airport and local fare information
- `/contact` — Contact details, map, and a message form

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Updating Business Info

Business details (address, phone numbers, hours, service area, rates) live
in [`utils/business.ts`](./utils/business.ts) — update that file to change
information shown across the site.
