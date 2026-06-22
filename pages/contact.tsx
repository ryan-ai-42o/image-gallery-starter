import type { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { business } from "../utils/business";

const Contact: NextPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Ride request from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\n\n${message}`
    );
    window.location.href = `mailto:${business.email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <Head>
        <title>Contact | Star Cabs of Metairie</title>
      </Head>

      <section className="bg-ink py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Contact Us</h1>
          <p className="mt-4 text-white/80">
            Call now for the fastest pickup, or send us a message.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold">Get In Touch</h2>
          <ul className="space-y-3 text-ink/80">
            <li>
              <span className="font-semibold">Address: </span>
              {business.address.street}, {business.address.city},{" "}
              {business.address.state} {business.address.zip}
            </li>
            <li>
              <span className="font-semibold">Phone: </span>
              <a href={`tel:${business.phones.primary}`} className="text-brand-dark">
                {business.phones.primary}
              </a>{" "}
              /{" "}
              <a href={`tel:${business.phones.secondary}`} className="text-brand-dark">
                {business.phones.secondary}
              </a>
            </li>
            <li>
              <span className="font-semibold">Toll-Free: </span>
              <a href={`tel:${business.phones.tollFree}`} className="text-brand-dark">
                {business.phones.tollFree}
              </a>
            </li>
            <li>
              <span className="font-semibold">Email: </span>
              <a href={`mailto:${business.email}`} className="text-brand-dark">
                {business.email}
              </a>
            </li>
            <li>
              <span className="font-semibold">Hours: </span>
              {business.hours}
            </li>
          </ul>

          <div className="mt-6 overflow-hidden rounded-lg border">
            <iframe
              title="Star Cabs location"
              width="100%"
              height="250"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.zip}`
              )}&output=embed`}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">Send a Message</h2>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-brand px-6 py-3 font-bold text-ink transition hover:bg-brand-dark"
          >
            Send Message
          </button>
        </form>
      </section>
    </>
  );
};

export default Contact;
