import type { NextPage } from "next";
import Head from "next/head";
import { business } from "../utils/business";

const services = [
  {
    title: "Airport Transfers",
    description:
      "Star Cabs provides dependable pickup and drop-off service at Louis Armstrong International Airport (MSY). Give us your flight details and a driver will be ready when you land.",
  },
  {
    title: "Local Taxi Service",
    description:
      "Need a ride across Metairie, Kenner, Harahan, or River Ridge? Our metered local service runs around the clock.",
  },
  {
    title: "Business & Convention Travel",
    description:
      "We work with companies and conventions across Jefferson Parish to arrange reliable group and individual transportation.",
  },
  {
    title: "Car Seats Available",
    description:
      "Traveling with young children? Let our dispatcher know when you call and a car seat will be ready for your trip.",
  },
  {
    title: "Prearranged Pickups",
    description:
      "Book ahead for early flights, late arrivals, or scheduled appointments so a cab is waiting exactly when you need it.",
  },
];

const Services: NextPage = () => {
  return (
    <>
      <Head>
        <title>Services | Star Cabs of Metairie</title>
      </Head>

      <section className="bg-ink py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Our Services</h1>
          <p className="mt-4 text-white/80">
            Late-model, well-maintained vehicles and a 24-hour dispatch team
            ready to get you where you're going.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-8">
          {services.map((service) => (
            <div key={service.title} className="border-b pb-8 last:border-none">
              <h2 className="mb-2 text-xl font-bold">{service.title}</h2>
              <p className="text-ink/70">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-4 text-2xl font-bold">Our Commitment to Riders</h2>
          <p className="text-ink/70">
            All Star Cabs drivers must follow a strict zero-tolerance policy
            regarding drugs and alcohol. If you have a concern about a ride,
            please call{" "}
            <a href={`tel:${business.zeroTolerancePhone}`} className="font-semibold text-brand-dark">
              {business.zeroTolerancePhone}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${business.email}`} className="font-semibold text-brand-dark">
              {business.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
};

export default Services;
