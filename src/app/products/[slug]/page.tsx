"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { useCart } from "@/context/CartContext";
import {
  ChevronLeft,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Minus,
  Plus,
  Loader2,
  ArrowRight,
  RefreshCw,
  Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Gallery State
  const [activeImage, setActiveImage] = useState(0);

  // Tab State
  const [activeTab, setActiveTab] = useState<"desc" | "info" | "reviews">(
    "desc",
  );

  // Review States
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    comment: "",
    rating: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slugOrId = params?.slug;

  useEffect(() => {
    async function fetchPageData() {
      if (!slugOrId) return;
      try {
        setLoading(true);
        const isNumeric = !isNaN(Number(slugOrId));
        const column = isNumeric ? "id" : "slug";

        // 1. Fetch Main Product
        const { data: productData, error: pError } = await supabase
          .from("products")
          .select("*")
          .eq(column, slugOrId)
          .maybeSingle();

        if (pError) throw pError;
        setProduct(productData);

        if (productData) {
          // 2. Fetch Reviews
          const { data: reviewsData } = await supabase
            .from("reviews")
            .select("*")
            .eq("product_id", productData.id)
            .order("created_at", { ascending: false });
          setReviews(reviewsData || []);

          // 3. Fetch Related Products (Same category, different ID)
          const { data: relatedData } = await supabase
            .from("products")
            .select("*")
            .eq("category", productData.category)
            .neq("id", productData.id)
            .limit(4);
          setRelatedProducts(relatedData || []);
        }
      } catch (err) {
        console.error("VOS Engine Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPageData();
  }, [slugOrId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment)
      return alert("Please fill in all fields");

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([
          {
            product_id: product.id,
            user_name: reviewForm.name,
            user_email: reviewForm.email,
            comment: reviewForm.comment,
            rating: reviewForm.rating,
          },
        ])
        .select();

      if (error) throw error;
      setReviews((prev) => [data[0], ...prev]);
      setReviewForm({ name: "", email: "", comment: "", rating: 5 });
      alert("Your testimonial has been archived.");
    } catch (err: any) {
      console.error("Submission Error:", err.message || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#f5f2f0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#5c4033] animate-spin" />
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-[#f5f2f0] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl text-[#5c4033] mb-4 font-serif italic">
          Fragrance Not Found
        </h2>
        <button
          onClick={() => router.push("/shop")}
          className="px-6 py-3 bg-[#5c4033] text-white text-[11px] uppercase tracking-widest font-bold"
        >
          Return to Collection
        </button>
      </div>
    );

  // Handles fallback if 'images' array is empty/null
  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url];

  return (
    <main className="min-h-screen bg-[#f5f2f0] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/shop")}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8c786a] mb-12 hover:text-[#5c4033] transition-colors font-bold"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Collection
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          {/* Left Side: Multi-Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] bg-white border border-[#d4b996]/30 shadow-sm overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={allImages[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              {product.concentration && (
                <span className="absolute top-6 left-6 bg-white/90 px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-bold text-[#5c4033]">
                  {product.concentration}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 aspect-square border transition-all flex-shrink-0 ${
                      activeImage === idx
                        ? "border-[#5c4033] ring-1 ring-[#5c4033]"
                        : "border-[#d4b996]/30 hover:border-[#5c4033]"
                    }`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`Thumbnail ${idx}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div className="flex flex-col justify-center">
            <span className="text-[#d4b996] text-[10px] tracking-[0.4em] uppercase font-bold mb-3">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl text-[#5c4033] font-serif italic mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-10">
              <p className="text-2xl text-[#5c4033] font-bold">
                Rs. {product.price?.toLocaleString()}
              </p>
              <div className="h-4 w-[1px] bg-[#d4b996]/50" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i + 1 <= (product.rating || 0) ? "fill-[#d4b996] text-[#d4b996]" : "text-[#d4b996]/30"}`}
                  />
                ))}
                <span className="text-[10px] text-[#8c786a] ml-1 font-bold">
                  ({product.rating?.toFixed(1) || "0.0"})
                </span>
              </div>
            </div>

            {/* Trust & Perks List */}
            <div className="space-y-5 mb-12">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#d4b996]/20 shadow-sm group-hover:border-[#d4b996] transition-colors">
                  <RefreshCw className="w-4 h-4 text-[#d4b996]" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#5c4033]">
                  7-Days Complimentary Returns
                </span>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#d4b996]/20 shadow-sm group-hover:border-[#d4b996] transition-colors">
                  <Gift className="w-4 h-4 text-[#d4b996]" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#5c4033]">
                  Free 5ml Discovery Scent Included
                </span>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#d4b996]/20 shadow-sm group-hover:border-[#d4b996] transition-colors">
                  <ShieldCheck className="w-4 h-4 text-[#d4b996]" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#5c4033]">
                  Secured VOS Signature Packaging
                </span>
              </div>
            </div>

            {/* Quantity and Add to Bag */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center border border-[#d4b996] bg-white h-14">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full hover:bg-[#f5f2f0]"
                >
                  <Minus className="w-4 h-4 text-[#5c4033]" />
                </button>
                <span className="w-12 text-center font-bold text-[#5c4033]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 h-full hover:bg-[#f5f2f0]"
                >
                  <Plus className="w-4 h-4 text-[#5c4033]" />
                </button>
              </div>
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  setIsAdded(true);
                  setIsCartOpen(true);
                  setTimeout(() => setIsAdded(false), 2000);
                }}
                className="w-full sm:flex-1 bg-[#5c4033] text-white h-14 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* --- TABS SECTION --- */}
        <section className="border-t border-[#d4b996]/20 pt-16 mb-32">
          <div className="flex justify-center gap-8 md:gap-16 mb-12 border-b border-[#d4b996]/10">
            {["desc", "info", "reviews"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-bold relative ${activeTab === t ? "text-[#5c4033]" : "text-stone-400"}`}
              >
                {t === "desc"
                  ? "Description"
                  : t === "info"
                    ? "Details"
                    : `Reviews (${reviews.length})`}
                {activeTab === t && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5c4033]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === "desc" && (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-stone-600 leading-loose text-sm font-light italic text-center"
                >
                  <p className="max-w-2xl mx-auto">
                    {product.long_description || product.description}
                  </p>
                </motion.div>
              )}

              {activeTab === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-[11px]"
                >
                  <div className="space-y-4">
                    <h5 className="text-[#5c4033] font-bold uppercase tracking-widest mb-4">
                      Specifications
                    </h5>
                    <div className="flex justify-between border-b border-[#d4b996]/10 pb-2">
                      <span className="text-stone-400 uppercase">
                        Longevity
                      </span>
                      <span className="font-bold text-[#5c4033]">
                        12+ Hours
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#d4b996]/10 pb-2">
                      <span className="text-stone-400 uppercase">Sillage</span>
                      <span className="font-bold text-[#5c4033]">
                        Enchanting / Strong
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[#5c4033] font-bold uppercase tracking-widest mb-4">
                      Composition
                    </h5>
                    <div className="flex justify-between border-b border-[#d4b996]/10 pb-2">
                      <span className="text-stone-400 uppercase">
                        Concentration
                      </span>
                      <span className="font-bold text-[#5c4033]">
                        Extrait de Parfum
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-[#d4b996]/10 pb-2">
                      <span className="text-stone-400 uppercase">Gender</span>
                      <span className="font-bold text-[#5c4033]">Unisex</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-12"
                >
                  {/* Review List */}
                  <div className="space-y-8">
                    {reviews.length > 0 ? (
                      reviews.map((r, i) => (
                        <div
                          key={i}
                          className="border-b border-[#d4b996]/10 pb-6"
                        >
                          <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, starI) => (
                              <Star
                                key={starI}
                                className={`w-2 h-2 ${starI < r.rating ? "fill-[#d4b996] text-[#d4b996]" : "text-stone-200"}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-stone-600 italic mb-2 font-light italic leading-relaxed">
                            "{r.comment}"
                          </p>
                          <span className="text-[9px] text-[#5c4033] font-bold uppercase tracking-widest">
                            — {r.user_name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-stone-400 text-xs italic">
                        No testimonials archived yet for this scent.
                      </p>
                    )}
                  </div>

                  {/* Review Form */}
                  <div className="bg-white p-8 border border-[#d4b996]/20 shadow-sm">
                    <h4 className="font-serif italic text-xl text-[#5c4033] mb-6">
                      Leave a Testimonial
                    </h4>
                    <form className="space-y-4" onSubmit={handleReviewSubmit}>
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() =>
                              setReviewForm({ ...reviewForm, rating: s })
                            }
                          >
                            <Star
                              className={`w-4 h-4 ${s <= reviewForm.rating ? "fill-[#5c4033] text-[#5c4033]" : "text-stone-200"}`}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          value={reviewForm.name}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              name: e.target.value,
                            })
                          }
                          type="text"
                          placeholder="NAME"
                          className="w-full bg-transparent border-b border-stone-200 py-3 text-[10px] tracking-widest focus:outline-none focus:border-[#d4b996]"
                          required
                        />
                        <input
                          value={reviewForm.email}
                          onChange={(e) =>
                            setReviewForm({
                              ...reviewForm,
                              email: e.target.value,
                            })
                          }
                          type="email"
                          placeholder="EMAIL"
                          className="w-full bg-transparent border-b border-stone-200 py-3 text-[10px] tracking-widest focus:outline-none focus:border-[#d4b996]"
                          required
                        />
                      </div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            comment: e.target.value,
                          })
                        }
                        placeholder="YOUR EXPERIENCE"
                        rows={4}
                        className="w-full bg-transparent border-b border-stone-200 py-3 text-[10px] tracking-widest focus:outline-none focus:border-[#d4b996] resize-none"
                        required
                      />
                      <button
                        disabled={isSubmitting}
                        className="bg-[#5c4033] text-white px-8 py-4 text-[9px] tracking-[0.3em] uppercase font-bold hover:bg-black transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? "Processing..." : "Submit Testimonial"}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* --- RELATED PRODUCTS SECTION --- */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-[#d4b996]/20 pt-20">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-[#d4b996] text-[10px] tracking-[0.4em] uppercase font-bold">
                  Discover More
                </span>
                <h3 className="text-3xl text-[#5c4033] font-serif italic mt-2">
                  Related Fragrances
                </h3>
              </div>
              <button
                onClick={() => router.push("/shop")}
                className="text-[10px] uppercase tracking-widest font-bold text-[#5c4033] flex items-center gap-2 hover:gap-4 transition-all pb-1 border-b border-[#5c4033]"
              >
                View Collection <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <motion.div
                  key={rel.id}
                  whileHover={{ y: -10 }}
                  onClick={() => router.push(`/products/${rel.slug || rel.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-[3/4] bg-white border border-[#d4b996]/10 mb-4 overflow-hidden relative">
                    <img
                      src={rel.image_url}
                      alt={rel.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#5c4033]/0 group-hover:bg-[#5c4033]/5 transition-colors duration-300" />
                  </div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#5c4033] mb-1">
                    {rel.name}
                  </h4>
                  <p className="text-[10px] text-[#8c786a] font-light italic">
                    Rs. {rel.price?.toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
