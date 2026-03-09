export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-amber-100">
      {/* Navigation */}
      {/* High-End Navigation with Search & Logo */}
      <nav className="p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-50 gap-4">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="VOS Logo"
            className="h-10 w-auto object-contain"
          />
          <h1 className="ml-3 text-lg tracking-[0.4em] font-light uppercase hidden sm:block">
            VOS
          </h1>
        </div>

        {/* Search Bar Section */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search the collection..."
            className="w-full bg-gray-50 border-none py-2 px-10 text-[10px] tracking-widest uppercase focus:ring-1 focus:ring-amber-200 outline-none transition-all"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Links Section */}
        <div className="flex space-x-8 text-[9px] tracking-[0.3em] uppercase text-gray-500 font-medium">
          <a href="#" className="hover:text-amber-800 transition-colors">
            Shop
          </a>
          <a href="#" className="hover:text-amber-800 transition-colors">
            Account
          </a>
          <a href="#" className="hover:text-amber-800 transition-colors">
            Cart (0)
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-32 px-6 text-center">
        <span className="text-[10px] tracking-[0.5em] text-amber-800 uppercase mb-4">
          25% Extrait de Parfum
        </span>
        <h2 className="text-6xl md:text-8xl font-extralight tracking-tighter mb-8 italic">
          Victorious Creed
        </h2>
        <p className="max-w-md text-gray-400 text-sm leading-relaxed mb-12">
          A scent that commands respect. Experience the power of pure Arabian
          opulence. 🏛️🌑
        </p>
        <button className="bg-black text-white px-14 py-4 text-[10px] tracking-[0.4em] uppercase hover:bg-zinc-800 transition-all active:scale-95">
          Explore the Collection
        </button>
      </section>
    </main>
  );
}
