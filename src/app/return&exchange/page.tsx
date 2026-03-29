"use client";
import React, { useState } from "react";
import { supabase } from "@/supabaseClient";

export default function ReturnPolicy() {
  const [formData, setFormData] = useState({
    name: "",
    orderNumber: "",
    contactNumber: "", // Added this
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please attach visual evidence (Video or Images) to proceed. 🏛️");
      return;
    }

    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(
        "The file exceeds the 15MB Vault limit. Please compress or shorten the video. 📽️",
      );
      return;
    }

    setStatus("uploading");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `claims/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("claim-attachments")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("claim-attachments")
        .getPublicUrl(filePath);
      const attachmentUrl = urlData.publicUrl;

      const { error: dbError } = await supabase.from("claims").insert([
        {
          name: formData.name,
          order_id: formData.orderNumber,
          contact_number: formData.contactNumber, // Mapping the new field
          complaint: formData.message,
          attachment_url: attachmentUrl,
        },
      ]);

      if (dbError) throw dbError;

      setStatus("success");
      setFormData({
        name: "",
        orderNumber: "",
        contactNumber: "",
        message: "",
      });
      setFile(null);
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
      {/* --- HEADER --- */}
      <header className="pt-32 pb-16 px-8 md:px-16 max-w-7xl mx-auto border-b border-stone-200">
        <h2 className="text-[10px] tracking-[0.6em] uppercase text-[#d4b996] mb-4 font-bold">
          Assurance
        </h2>
        <h1 className="font-serif text-6xl md:text-8xl tracking-tighter uppercase text-[#5c4033] leading-none">
          Return & <br /> Exchange
        </h1>
        <p className="mt-8 text-sm text-stone-400 uppercase tracking-widest text-left">
          The Sovereign Guarantee
        </p>
      </header>

      {/* --- CONTENT (Sections 01-05 Unaltered) --- */}
      <main className="max-w-4xl mx-auto px-8 md:px-16 py-20 space-y-16 text-left">
        <section>
          <h3 className="font-serif text-2xl uppercase tracking-widest text-[#5c4033] mb-6 border-l-4 border-[#d4b996] pl-6">
            01. The Nature of Scent
          </h3>
          <p className="text-stone-700 leading-loose font-light">
            Due to the artisanal and hygienic nature of our fragrances, VOS does
            not accept returns or exchanges on opened or used products. We
            encourage our patrons to review the olfactory notes provided in our
            digital Vault before completing a purchase. Once a seal is broken,
            the scent belongs to its owner.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-2xl uppercase tracking-widest text-[#5c4033] mb-6 border-l-4 border-[#d4b996] pl-6">
            02. Damaged or Defective Goods
          </h3>
          <p className="text-stone-700 leading-loose font-light">
            In the rare event that your order arrives with a structural
            defect—such as a failing atomizer or glass damage—we will replace
            the item immediately. Patrons must report such discrepancies within
            **48 hours** of delivery, accompanied by photographic evidence of
            the defect.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-2xl uppercase tracking-widest text-[#5c4033] mb-6 border-l-4 border-[#d4b996] pl-6">
            03. The Packing Protocol
          </h3>
          <p className="text-stone-700 leading-loose font-light">
            To ensure absolute transparency, VOS will dispatch a video of your
            specific order being packed via WhatsApp prior to shipping. Upon
            receiving your package, if you find the seal or packing does not
            match the video provided, you must send us an unboxing video on that
            same day. Your 2-day return and exchange eligibility period begins
            the moment the order is officially received.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-2xl uppercase tracking-widest text-[#5c4033] mb-6 border-l-4 border-[#d4b996] pl-6">
            04. Shipping & Logistics
          </h3>
          <p className="text-stone-700 leading-loose font-light">
            For approved exchanges regarding damaged goods, VOS will coordinate
            the logistics. For all other inquiries, shipping costs are the
            responsibility of the patron. Please note that transit times within
            Rawalpindi and across Pakistan may vary based on external courier
            factors beyond the Vault's control.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-2xl uppercase tracking-widest text-[#5c4033] mb-6 border-l-4 border-[#d4b996] pl-6">
            05. Contact for Claims
          </h3>
          <p className="text-stone-700 leading-loose font-light italic">
            All claims must be initiated through our official WhatsApp channel
            or the suggestion portal on this site. Please provide your Order ID
            for swift architectural resolution.
          </p>
        </section>

        {/* --- DYNAMIC CLAIM FORM --- */}
        <section className="pt-20 border-t border-stone-200">
          <h2 className="font-serif text-4xl uppercase text-[#5c4033] mb-4">
            Dispatch Claim
          </h2>
          <p className="text-stone-500 font-light text-lg mb-10 leading-relaxed">
            Kindly provide the necessary documentation below. Evidence is
            required for the Vault to process any exchange requests.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input
                type="text"
                placeholder="Customer Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-transparent border-b border-stone-300 py-4 focus:border-[#d4b996] outline-none text-sm uppercase tracking-[0.2em]"
              />
              <input
                type="text"
                placeholder="Order Number"
                required
                value={formData.orderNumber}
                onChange={(e) =>
                  setFormData({ ...formData, orderNumber: e.target.value })
                }
                className="bg-transparent border-b border-stone-300 py-4 focus:border-[#d4b996] outline-none text-sm uppercase tracking-[0.2em]"
              />
              {/* CONTACT NUMBER FIELD */}
              <input
                type="text"
                placeholder="WhatsApp Number"
                required
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                className="bg-transparent border-b border-stone-300 py-4 focus:border-[#d4b996] outline-none text-sm uppercase tracking-[0.2em] md:col-span-2"
              />
            </div>

            <textarea
              placeholder="Message / Description of Complaint"
              rows={4}
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full bg-transparent border-b border-stone-300 py-4 focus:border-[#d4b996] outline-none text-sm uppercase tracking-[0.2em] resize-none"
            ></textarea>

            <div className="border-b border-stone-200 pb-8">
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[#d4b996] font-bold mb-4">
                Attach Visual Evidence (Max 4 Images or 1 Video)
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-[10px] uppercase tracking-widest cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-bold file:bg-[#5c4033] file:text-white hover:file:bg-black transition-all"
              />
              <div className="mt-4 space-y-1">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">
                  * Video must not exceed 30 seconds.
                </p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">
                  * Maximum file size: 15MB.
                </p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">
                  * Recommended Resolution: 1080p or lower.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "uploading"}
              className="bg-black text-white px-12 py-5 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#5c4033] transition-all disabled:bg-stone-300"
            >
              {status === "uploading"
                ? "Dispatching to Vault..."
                : status === "success"
                  ? "Claim Received 🏛️"
                  : "Submit Claim"}
            </button>

            {status === "error" && (
              <p className="text-red-500 text-[10px] uppercase tracking-widest">
                Vault connection error. Please verify file size and try again.
              </p>
            )}
          </form>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="px-8 md:px-16 max-w-7xl mx-auto border-t border-stone-200 pt-12">
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-stone-300">
          Victorious Opulent Scents © 2026
        </p>
      </footer>
    </div>
  );
}
