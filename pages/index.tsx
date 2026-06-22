import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Taxi from "../components/Icons/Taxi";
import { business } from "../utils/business";

const features = [
  {
    title: "24/7 Dispatch",
    description: "Day or night, a driver is always on the way.",
  },
  {
    title: "Flat Airport Rates",
    description: "Predictable pricing to and from Louis Armstrong (MSY).",
  },
  {
    title: "Local & Trusted",
    description: "Serving Jefferson Parish and Greater New Orleans.",
  },
  {
    title: "Car Seats Available",
    description: "Traveling with kids? Just ask when you book.",
  },
];

const services = [
  {
    title: "Airport Transfers",
    description:
      "Reliable pickup and drop-off at Louis Armstrong International Airport (MSY), with flat fares for groups.",
  },
  {
    title: "Local Taxi Rides",
    description:
      "Quick, metered rides anywhere in Metairie, Kenner, and the surrounding area.",
  },
  {
    title: "Business Travel",
    description:
      "Prearranged pickups for meetings, conventions, and corporate travel.",
  },
  {
    title: "Nights Out",
    description:
      "Skip the parking and let a Star Cabs driver handle the ride home.",
  },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Star Cabs | 24-Hour Taxi Service in Metairie, LA</title>
      </Head>

      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center">
          <Taxi className="h-16 w-16 text-brand" />
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            {business.name} of Metairie
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            {business.tagline}. Call us anytime for a ride to the airport,
            across town, or anywhere in between.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${business.phones.primary}`}
              className="rounded-md bg-brand px-6 py-3 font-bold text-ink transition hover:bg-brand-dark"
            >
              Call {business.phones.primary}
            </a>
            <Link
              href="/rates"
              className="rounded-md border border-white px-6 py-3 font-bold text-white transition hover:bg-white hover:text-ink"
            >
              View Rates
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-lg border p-6 text-center">
              <h3 className="mb-2 font-bold">{feature.title}</h3>
              <p className="text-sm text-ink/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            Where We Take You
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-2 font-bold">{service.title}</h3>
                <p className="text-sm text-ink/70">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/services" className="font-semibold text-brand-dark hover:underline">
              See all services &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Proudly Serving</h2>
        <p className="text-ink/70">{business.serviceArea.join(" · ")}</p>
      </section>
    </>
  );
};

export default Home;
