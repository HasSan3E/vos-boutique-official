import React from "react";

export default function PrivacyPolicy() {
  return (
    <div
      className="bg-[#faf9f6] min-h-screen text-[#1a1a1a] pb-32 font-sans"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {/* --- HEADER --- */}
      <header className="pt-32 pb-16 px-8 md:px-16 max-w-7xl mx-auto border-b border-stone-200">
        <h2 className="text-[10px] tracking-[0.6em] uppercase text-[#d4b996] mb-4 font-bold">
          Legal
        </h2>
        <h1 className="font-serif text-5xl md:text-7xl tracking-tighter uppercase text-[#5c4033] leading-none">
          Privacy Policy
        </h1>
        <p className="mt-8 text-sm text-stone-400 uppercase tracking-widest">
          Last Updated: March 2026
        </p>
      </header>

      {/* --- CONTENT --- */}
      <main className="max-w-4xl mx-auto px-8 md:px-16 py-20 space-y-16">
        <section>
          <h3 className="font-serif text-2xl uppercase tracking-widest text-[#5c4033] mb-6">
            01. Data Collection
          </h3>
          <p className="text-stone-700 leading-loose font-light">
            At VOS, we respect the sanctity of your personal information. We
            collect only the data necessary to provide an opulent experience:
            your name, contact details, and shipping address. This information
            is gathered when you place an order or submit a suggestion to our
            Vault.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-2xl uppercase tracking-widest text-[#5c4033] mb-6">
            02. Purpose of Use
          </h3>
          <p className="text-stone-700 leading-loose font-light">
            Your data serves the architectural integrity of our service. We use
            it strictly for processing orders, communicating logistics via
            WhatsApp or Email, and refining our fragrance collection based on
            your direct feedback. We do not engage in the trade or sale of
            patron data to third parties.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-2xl uppercase tracking-widest text-[#5c4033] mb-6">
            03. Security & The Vault
          </h3>
          <p className="text-stone-700 leading-loose font-light">
            We employ industry-standard encryption and Row-Level Security (RLS)
            within our database architecture. Your information is stored within
            a secure digital vault, accessible only to the essential curators of
            VOS to ensure your order reaches its destination in Rawalpindi and
            beyond.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-2xl uppercase tracking-widest text-[#5c4033] mb-6">
            04. Your Rights
          </h3>
          <p className="text-stone-700 leading-loose font-light">
            As a patron of VOS, you maintain full sovereignty over your data.
            You may request the modification or absolute deletion of your
            personal records from our system at any time by reaching out through
            our official contact channels.
          </p>
        </section>
      </main>

      {/* --- FOOTER CTA --- */}
      <footer className="px-8 md:px-16 max-w-7xl mx-auto border-t border-stone-200 pt-12">
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300">
          Victorious Opulent Scents © 2026
        </p>
      </footer>
    </div>
  );
}
