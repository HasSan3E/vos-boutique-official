"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/supabaseClient";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ShoppingBag,
  Heart,
  ChevronDown,
  Sparkles,
  Check,
  Plus,
  Star,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  category: string;
  description: string;
  image_url: string;
  scent_notes?: string[];
  rating?: number;
  reviews_count?: number;
  created_at: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const { addToCart, setIsCartOpen } = useCart();
  const router = useRouter();

  const [filters, setFilters] = useState({
    category: "all",
    priceRange: [0, 50000],
    sortBy: "featured",
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }
    return result;
  }, [products, searchQuery, filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f2f0] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#5c4033] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f2f0] pt-20">
      {/* Hero */}
      <section className="h-[40vh] bg-[#5c4033] relative flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2000"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="Hero"
        />
        <div className="relative text-center text-white px-4">
          <h1 className="text-5xl font-serif italic mb-4">The Collection</h1>
          <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-[#d4b996]">
            Experience the Essence
          </p>
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-0 z-30 bg-[#f5f2f0]/95 backdrop-blur-md border-b border-[#d4b996]/30 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c786a]" />
            <input
              type="text"
              placeholder="Search fragrances..."
              className="w-full bg-white border border-[#d4b996]/50 py-3 pl-12 pr-4 text-sm focus:outline-none"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select
              className="flex-1 md:w-48 bg-white border border-[#d4b996]/50 px-4 py-3 text-[11px] uppercase tracking-widest font-bold"
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="all">All Categories</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => (
            <motion.div key={product.id} layout className="group">
              <div
                className="relative aspect-[4/5] bg-white border border-[#d4b996]/30 overflow-hidden cursor-pointer"
                onClick={() =>
                  router.push(`/products/${product.slug || product.id}`)
                }
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                {/* Quick Add */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                    setAddedProductId(product.id);
                    setIsCartOpen(true);
                    setTimeout(() => setAddedProductId(null), 2000);
                  }}
                  className="absolute bottom-4 left-4 right-4 bg-[#5c4033] text-white py-3 text-[10px] uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                >
                  {addedProductId === product.id ? "Added to Bag" : "Quick Add"}
                </button>
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-xl text-[#5c4033] font-serif italic mb-1">
                  {product.name}
                </h3>
                <p className="text-[10px] tracking-widest text-[#8c786a] uppercase mb-2">
                  {product.category}
                </p>
                <p className="text-sm font-bold text-[#5c4033]">
                  Rs. {product.price.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
