export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-stone-400 px-10 pt-28 pb-12 border-t border-stone-800/50 font-sans tracking-tight">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-20 gap-y-16 mb-24">
        {/* COLUMN 1: BRAND STORY */}
        <div className="space-y-7">
          <h3 className="font-serif text-xl text-white uppercase tracking-[0.4em] whitespace-nowrap">
            VOS Fragrance
          </h3>
          <p className="text-[11px] leading-relaxed tracking-[0.05em] italic text-stone-500 max-w-[280px]">
            Victorious Opulent Scents crafted for those who demand presence. We
            specialize in 25% Extrait de Parfum, ensuring every spray tells a
            story of heritage and modern luxury.
          </p>
        </div>

        {/* COLUMN 2: COLLECTIONS */}
        <div className="space-y-9">
          <h4 className="text-[10px] uppercase tracking-[0.6em] text-white font-bold opacity-90">
            Collections
          </h4>
          <ul className="space-y-6 text-[9px] uppercase tracking-[0.4em] font-semibold">
            <li>
              <a
                href="/shop?category=Men"
                className="hover:text-white transition-all duration-300 hover:pl-2"
              >
                Men's Fragrances
              </a>
            </li>
            <li>
              <a
                href="/shop?category=Women"
                className="hover:text-white transition-all duration-300 hover:pl-2"
              >
                Women's Fragrances
              </a>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: CORPORATE */}
        <div className="space-y-9">
          <h4 className="text-[10px] uppercase tracking-[0.6em] text-white font-bold opacity-90">
            Corporate
          </h4>
          <ul className="space-y-6 text-[9px] uppercase tracking-[0.4em] font-semibold">
            <li>
              <a
                href="#"
                className="hover:text-white transition-all duration-300 hover:pl-2"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-white transition-all duration-300 hover:pl-2"
              >
                Contact Support
              </a>
            </li>
          </ul>
        </div>

        {/* COLUMN 4: FOLLOW US */}
        <div className="space-y-9">
          <h4 className="text-[10px] uppercase tracking-[0.6em] text-white font-bold opacity-90">
            Follow Us
          </h4>
          <ul className="space-y-6 text-[9px] uppercase tracking-[0.4em] font-semibold">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                className="hover:text-white transition-all duration-300 hover:pl-2"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com"
                target="_blank"
                className="hover:text-white transition-all duration-300 hover:pl-2"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                className="hover:text-white transition-all duration-300 hover:pl-2"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto pt-14 border-t border-stone-800/30 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left space-y-3">
          <p className="text-[10px] tracking-[0.3em] font-bold text-stone-200">
            support@vosfragrance.com
          </p>
          <p className="text-[8px] uppercase tracking-[0.6em] text-stone-600 font-medium">
            © 2026 VOS FRAGRANCE. CRAFTED IN PAKISTAN.
          </p>
        </div>
      </div>
    </footer>
  );
}
