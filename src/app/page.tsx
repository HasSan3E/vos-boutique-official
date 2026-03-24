"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Newsletter states
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false });

        if (error) throw error;
        if (data) setProducts(data);
      } catch (err) {
        console.error("VOS Engine Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [products]);

  // Newsletter subscription handler
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setSubscribeStatus("error");
      setSubscribeMessage("Please enter a valid email address");
      return;
    }

    setSubscribeStatus("loading");

    try {
      // 1. Save to Supabase (Database)
      const { error: dbError } = await supabase
        .from("subscribers")
        .insert([{ email: email.toLowerCase().trim() }]);

      if (dbError) {
        if (dbError.code === "23505") throw new Error("Already subscribed.");
        throw dbError;
      }

      // 2. Trigger the Welcome Email (Gmail via Resend)
      const emailRes = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      if (!emailRes.ok) throw new Error("Database saved, but email failed.");

      setSubscribeStatus("success");
      setSubscribeMessage("Welcome to The Sovereign Circle! Check your inbox.");
      setEmail("");

      setTimeout(() => setSubscribeStatus("idle"), 5000);
    } catch (error: any) {
      setSubscribeStatus("error");
      setSubscribeMessage(error.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] font-sans text-black overflow-x-hidden">
      {loading ? (
        <div className="h-[85vh] flex items-center justify-center text-stone-400 tracking-widest text-[10px] uppercase animate-pulse">
          Initializing VOS Collection...
        </div>
      ) : products.length > 0 ? (
        <section className="relative h-[85vh] w-full flex items-center justify-start overflow-hidden bg-stone-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-black/20 z-10" />
              <img
                src={
                  products[currentSlide]?.hero_image_url ||
                  products[currentSlide]?.image_url
                }
                alt="VOS Hero"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-20 w-full md:w-1/2 px-10 md:px-20 text-white text-left">
            <motion.p
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] tracking-[0.5em] uppercase mb-4 text-[#d4b996] font-bold"
            >
              Victorious Opulent Scents
            </motion.p>

            <motion.h2
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-serif italic text-5xl md:text-7xl mb-8 leading-tight drop-shadow-xl"
            >
              Define Your <br />
              <span className="text-white opacity-90">Sovereign Presence</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link href="/shop">
                <button className="bg-[#5c4033] text-white px-12 py-5 text-[10px] tracking-[0.4em] uppercase hover:bg-black transition-all font-bold border border-[#d4b996]/30">
                  Shop Our Collection
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      ) : null}

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-32 px-8 bg-white text-center"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <span className="text-[10px] tracking-[0.8em] uppercase text-stone-400 font-bold block">
            The Essence of VOS
          </span>
          <h2 className="font-serif italic text-4xl md:text-5xl text-[#5c4033]">
            Concentrated to Perfection
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed font-light tracking-wide italic">
            "Unlike standard perfumes, VOS utilizes a 25% Extrait de Parfum
            concentration. This ensures a scent that doesn't just linger, but
            evolves with your skin from the first light of dawn to the deep of
            night."
          </p>
          <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-12"></div>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 md:grid-cols-2 h-[70vh] w-full bg-stone-100">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden group cursor-pointer border-r border-stone-200"
        >
          <Link href="/shop?category=Men">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors z-10" />
            <img
              src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2070"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Men"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
              <h3 className="font-serif text-4xl italic mb-4">The Sovereign</h3>
              <span className="text-[9px] tracking-[0.4em] uppercase border-b border-white/30 pb-2">
                Explore Mens
              </span>
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative overflow-hidden group cursor-pointer"
        >
          <Link href="/shop?category=Women">
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors z-10" />
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1974"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Women"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20">
              <h3 className="font-serif text-4xl italic mb-4">The Muse</h3>
              <span className="text-[9px] tracking-[0.4em] uppercase border-b border-white/30 pb-2">
                Explore Womens
              </span>
            </div>
          </Link>
        </motion.div>
      </section>

      <section className="px-8 py-32 bg-[#faf9f6]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-20"
        >
          <h3 className="font-serif text-4xl mb-4">The Collection</h3>
          <div className="w-8 h-[1px] bg-[#5c4033] mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={`/products/${product.slug || product.id}`}>
                <div className="aspect-[4/5] bg-stone-200 mb-6 overflow-hidden relative border border-stone-200 shadow-sm cursor-pointer">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  {product.category && (
                    <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[8px] uppercase tracking-widest font-bold text-stone-500">
                      {product.category}
                    </span>
                  )}
                </div>
              </Link>

              <Link href={`/products/${product.slug || product.id}`}>
                <h4 className="font-serif text-2xl mb-2 text-stone-800 tracking-tight cursor-pointer hover:text-[#5c4033] transition-colors">
                  {product.name}
                </h4>
              </Link>

              <p className="text-[11px] tracking-[0.2em] text-[#8c786a] uppercase mb-6 font-bold">
                Rs. {product.price?.toLocaleString()}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="w-full border border-black text-black py-4 text-[9px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-300 font-bold"
              >
                Add to Bag
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="bg-[#5c4033] py-24 px-8 md:px-24 mb-0 pb-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 space-y-6 text-left">
            <span className="text-[10px] tracking-[0.6em] uppercase text-[#d4b996] font-bold">
              The Sovereign Circle
            </span>
            <h2 className="font-serif italic text-4xl md:text-5xl text-white leading-tight">
              Stay Notified of <br /> New Masterpieces
            </h2>
            <p className="text-[#faf9f6]/70 font-light text-sm max-w-md leading-relaxed">
              Join our inner circle for exclusive early access to limited
              edition Extraits and the stories behind our scent architecture.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL ADDRESS"
                  disabled={subscribeStatus === "loading"}
                  className="w-full bg-transparent border-b border-[#d4b996]/40 py-4 text-white text-[11px] tracking-widest focus:outline-none focus:border-[#d4b996] transition-colors placeholder:text-stone-500 font-bold disabled:opacity-50"
                />
                {subscribeStatus === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-0 text-[10px] text-[#d4b996] font-bold"
                  >
                    {subscribeMessage}
                  </motion.p>
                )}
                {subscribeStatus === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-0 text-[10px] text-red-300 font-bold"
                  >
                    {subscribeMessage}
                  </motion.p>
                )}
              </div>
              <button
                type="submit"
                disabled={subscribeStatus === "loading"}
                className="bg-[#faf9f6] text-[#5c4033] px-10 py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-black hover:text-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribeStatus === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
