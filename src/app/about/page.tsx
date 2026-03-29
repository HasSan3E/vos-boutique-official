"use client";
import React, { useState } from "react";
import { supabase } from "@/supabaseClient";

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // HoneyPot field to trap bots
  const [honeyPot, setHoneyPot] = useState("");

  // Rate limiting state
  const [lastSent, setLastSent] = useState<number | null>(null);

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. HoneyPot Check: If this hidden field is filled, it's a bot.
    if (honeyPot !== "") {
      console.warn("Bot detected.");
      setStatus("success"); // Fake success to mislead the bot
      return;
    }

    // 2. Rate Limiting: Prevent sending more than one message every 2 minutes
    if (lastSent && Date.now() - lastSent < 120000) {
      alert(
        "Patience is a virtue. Please wait a moment before dispatching another suggestion. 🏛️",
      );
      return;
    }

    // 3. Sanitization: Strip HTML tags to prevent XSS
    const cleanMessage = formData.message.replace(/<[^>]*>?/gm, "");

    if (cleanMessage.length < 5) {
      alert("The message is too short for the Vault.");
      return;
    }

    setStatus("sending");

    try {
      const { error } = await supabase
        .from("suggestions")
        .insert([{ ...formData, message: cleanMessage }]);

      if (error) throw error;

      setStatus("success");
      setLastSent(Date.now());
      setFormData({ name: "", email: "", message: "" });

      // Reset status after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div
      className="bg-[#faf9f6] min-h-screen text-[#1a1a1a] pb-32 font-sans"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-8 md:px-16 max-w-7xl mx-auto border-b border-stone-200 text-left">
        <h2 className="text-[10px] tracking-[0.6em] uppercase text-[#d4b996] mb-4 font-bold">
          The Manifesto
        </h2>
        <h1 className="font-serif text-6xl md:text-9xl tracking-tighter uppercase text-[#5c4033] leading-none mb-8">
          Victorious <br /> Opulent Scents
        </h1>
        <p className="text-xl md:text-2xl font-serif italic text-stone-400 max-w-2xl">
          "We do not create fragrances. We engineer the invisible atmosphere of
          victory."
        </p>
      </section>

      {/* --- CONTENT GRID --- */}
      <main className="max-w-7xl mx-auto px-8 md:px-16 py-24 space-y-32">
        {/* SECTION 01: THE ORIGIN */}
        <section>
          <div className="max-w-3xl">
            <h3 className="font-serif text-3xl uppercase tracking-widest text-[#5c4033] mb-6 border-l-4 border-[#d4b996] pl-6">
              01. The Origin
            </h3>
            <p className="text-stone-700 leading-loose text-lg font-light mb-12">
              VOS exists at the vanishing point where digital precision meets
              the raw, untamed power of olfaction. Founded in Rawalpindi, VOS
              was built on a singular premise: that a fragrance should not just
              be worn, but inhabited. In a world of fleeting trends, we engineer
              'The Sovereign Experience'—a collection of scents designed for
              those who command their own destiny.
            </p>
          </div>
          <div className="w-full aspect-[21/9] bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.4em] text-stone-300 font-bold italic underline">
              Visual: Sourcing High-Quality Essential Oils
            </span>
          </div>
        </section>

        {/* SECTION 02: THE LOGIC */}
        <section>
          <div className="max-w-3xl">
            <h3 className="font-serif text-3xl uppercase tracking-widest text-[#5c4033] mb-6 border-l-4 border-[#d4b996] pl-6">
              02. The Logic
            </h3>
            <p className="text-stone-700 leading-loose text-lg font-light mb-12">
              The transition from software architecture to the alchemy of
              perfumery was not a change in direction, but a refinement of
              craft. At VOS, we view a perfume bottle as a repository of complex
              code. Instead of syntax, we use aromatic oils; instead of
              algorithms, we use molecular balance. Each scent in our Vault
              undergoes a rigorous formulation process, ensuring that our
              concentrations offer a sillage that persists long after the wearer
              has left the room.
            </p>
          </div>
          <div className="w-full aspect-[21/9] bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.4em] text-stone-300 font-bold italic underline">
              Visual: Precise Laboratory Formulation
            </span>
          </div>
        </section>

        {/* SECTION 03: THE AMBITION */}
        <section>
          <div className="max-w-3xl">
            <h3 className="font-serif text-3xl uppercase tracking-widest text-[#5c4033] mb-6 border-l-4 border-[#d4b996] pl-6">
              03. The Ambition
            </h3>
            <p className="text-stone-700 leading-loose text-lg font-light mb-12">
              We are a boutique house with global ambitions, proving that the
              next era of luxury is being written right here. VOS is a tribute
              to the architects, the dreamers, and the victors of the modern
              world. We don't settle for 'pleasant'; we aim for 'absolute'.
              Every drop is a calculation of confidence, crafted for the
              Sovereign.
            </p>
          </div>
          <div className="w-full aspect-[21/9] bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.4em] text-stone-300 font-bold italic underline">
              Visual: The Final VOS Product Experience
            </span>
          </div>
        </section>

        {/* --- REFINING THE VAULT FORM --- */}
        <section className="pt-20 border-t border-stone-200">
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl uppercase text-[#5c4033] mb-4">
              Refining the Vault
            </h2>
            <p className="text-stone-500 font-light text-lg mb-10 leading-relaxed">
              If you have suggestions for new notes or ways we can enhance the
              VOS experience, please share your thoughts.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* HONEYPOT - Hidden from users */}
              <input
                type="text"
                className="hidden"
                value={honeyPot}
                onChange={(e) => setHoneyPot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-transparent border-b border-stone-300 py-4 focus:border-[#d4b996] outline-none transition-all text-sm uppercase tracking-widest"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-transparent border-b border-stone-300 py-4 focus:border-[#d4b996] outline-none transition-all text-sm uppercase tracking-widest"
                  required
                />
              </div>
              <textarea
                placeholder="How can we improve VOS?"
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-transparent border-b border-stone-300 py-4 focus:border-[#d4b996] outline-none transition-all text-sm uppercase tracking-widest resize-none"
                required
              ></textarea>

              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-black text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#5c4033] transition-all disabled:bg-stone-300"
              >
                {status === "sending"
                  ? "Dispatching..."
                  : status === "success"
                    ? "Suggestion Received 🏛️"
                    : "Dispatch Suggestion"}
              </button>

              {status === "error" && (
                <p className="text-red-500 text-xs uppercase tracking-widest">
                  Vault connection error. Please try again.
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="px-8 md:px-16 max-w-7xl mx-auto">
        <div className="border-t border-stone-200 pt-12">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300">
            © 2026 VOS Boutique. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}  
