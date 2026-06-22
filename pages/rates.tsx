import type { NextPage } from "next";
import Head from "next/head";
import { business } from "../utils/business";

const Rates: NextPage = () => {
  return (
    <>
      <Head>
        <title>Rates | Star Cabs of Metairie</title>
      </Head>

      <section className="bg-ink py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Rates</h1>
          <p className="mt-4 text-white/80">
            Simple, predictable pricing for airport transfers and local rides.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="mb-4 text-2xl font-bold">
          Louis Armstrong International Airport (MSY)
        </h2>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-semibold">Passengers</th>
                <th className="px-6 py-3 font-semibold">Fare</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-6 py-4">1–2 passengers</td>
                <td className="px-6 py-4">{business.airportRate.onetwo}</td>
              </tr>
              <tr>
                <td className="px-6 py-4">3 or more passengers</td>
                <td className="px-6 py-4">{business.airportRate.threeplus}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="mb-4 mt-12 text-2xl font-bold">Local Rides</h2>
        <p className="text-ink/70">
          Local trips within Metairie and the surrounding area are calculated
          by meter. Call{" "}
          <a href={`tel:${business.phones.primary}`} className="font-semibold text-brand-dark">
            {business.phones.primary}
          </a>{" "}
          for an estimate before you book.
        </p>

        <p className="mt-8 text-sm text-ink/50">
          Rates are subject to change. Confirm current pricing with dispatch
          when you call.
        </p>
      </section>
    </>
  );
};

export default Rates;
