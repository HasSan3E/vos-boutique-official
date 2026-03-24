"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { setIsCartOpen, cart } = useCart();
  const [textIndex, setTextIndex] = useState(0);
  const messages = [
    "High-concentration oils",
    "7-day return policy",
    "8+ hours longevity",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full z-50">
      {/* 🏛️ TOP BAR: Static (Moves with the page) */}
      <div className="bg-[#5c4033] text-[#f4ece6] py-2 px-8 flex justify-between items-center border-b border-[#4a3329] relative z-10">
        {/* Left: Socials */}
        <div className="flex items-center gap-4">
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-2.21c0-.837.191-1.177 1.051-1.177h2.949v-4.613l-4.225-.011c-4.691 0-5.775 2.322-5.775 5.25v2.761z" />
            </svg>
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 448 512">
              <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z" />
            </svg>
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.355 2.618 6.778 6.98 6.978 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.197-4.347-2.633-6.778-6.98-6.978C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </div>

        {/* Center: Typewriter Effect */}
        <div className="flex-1 text-center h-4 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[8px] uppercase tracking-[0.5em] font-bold"
            >
              {messages[textIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Right: Contact Icons */}
        <div className="flex items-center gap-5">
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.101.005.237-.038.37.284.144.35.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.101-.177.211-.077.385.101.173.444.733.95 1.185.65.581 1.197.761 1.37.848s.303.058.419-.072c.116-.13.506-.59.643-.79.137-.201.274-.173.463-.101.188.072 1.197.561 1.4.664s.339.173.387.252c.048.079.048.455-.096.86z" />
            </svg>
          </a>
        </div>
      </div>

      {/* ⚪ MAIN NAVIGATION: Sticky (Stays at top when scrolling) */}
      <nav className="sticky top-0 left-0 w-full flex flex-col md:flex-row items-center justify-between px-8 py-4 border-b border-stone-200 gap-4 bg-white/95 backdrop-blur-md z-40">
        <div className="flex items-center">
          <a href="/">
            <img src="/logo.png" alt="VOS Logo" className="h-10 w-auto" />
          </a>
        </div>
        <div className="flex space-x-8 text-[9px] tracking-[0.3em] uppercase font-bold text-stone-500">
          <a href="/" className="hover:text-[#5c4033] transition-colors">
            Home
          </a>
          <a href="/shop" className="hover:text-[#5c4033] transition-colors">
            Shop
          </a>
          <a href="#" className="hover:text-[#5c4033] transition-colors">
            About
          </a>
        </div>
        <div className="flex items-center space-x-5">
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-stone-400 hover:text-[#5c4033] relative transition-colors p-2"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cart?.length > 0 && (
              <span className="absolute top-0 right-0 bg-[#5c4033] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
          <span className="text-[10px] font-bold text-stone-400 tracking-widest">
            ({cart?.length || 0})
          </span>
        </div>
      </nav>
    </header>
  );
}
