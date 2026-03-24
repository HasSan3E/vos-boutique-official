"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null);
  const [sendingDigest, setSendingDigest] = useState(false);
  const router = useRouter();

  // --- AUTH & DATA INITIALIZATION ---
  useEffect(() => {
    const initDashboard = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        await Promise.all([fetchOrders(), fetchProducts(), fetchComments()]);
        setLoading(false);
      }
    };
    initDashboard();
  }, [router]);

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
  }

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });
    if (data) setProducts(data);
  }

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setComments(data);
  }

  // --- BROADCAST LOGIC (Single Product) ---
  const handleBroadcast = async (product: any) => {
    const confirmSend = confirm(
      `Send promotional email for "${product.name}" to the entire Sovereign Circle?`,
    );
    if (!confirmSend) return;

    setBroadcastingId(product.id);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });

      if (res.ok) {
        alert("The Circle has been notified. 🏛️");
      } else {
        const errData = await res.json();
        alert("Broadcast Failed: " + (errData.error || "Unknown Error"));
      }
    } catch (err) {
      alert("System Error: Could not reach broadcast server.");
    } finally {
      setBroadcastingId(null);
    }
  };

  // --- MONTHLY DIGEST LOGIC ---
  const handleMonthlyDigest = async () => {
    if (!confirm("Dispatch the Monthly Edit digest to all subscribers?"))
      return;

    setSendingDigest(true);
    try {
      const res = await fetch("/api/admin/monthly", {
        method: "POST",
      });

      if (res.ok) {
        alert("Monthly Digest dispatched to the Circle! 🏛️");
      } else {
        const errData = await res.json();
        alert("Digest Failed: " + (errData.error || "Unknown Error"));
      }
    } catch (err) {
      alert("System Error: Could not reach broadcast server.");
    } finally {
      setSendingDigest(false);
    }
  };

  // --- ACTIONS ---
  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    if (confirm("Archive this order permanently?")) {
      await supabase.from("orders").delete().eq("id", id);
      fetchOrders();
    }
  };

  const deleteComment = async (id: string) => {
    if (confirm("Remove this comment from the website?")) {
      await supabase.from("comments").delete().eq("id", id);
      fetchComments();
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Delete this scent from the vault?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-serif italic text-stone-800">
        Accessing VOS Vault...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#faf9f6] text-black font-sans pb-20">
      {/* HEADER */}
      <nav className="bg-white border-b border-stone-200 px-8 py-6 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="font-serif text-2xl tracking-widest text-[#5c4033] uppercase">
            VOS Command
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-stone-400 font-bold uppercase">
            Master Administrator
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={handleMonthlyDigest}
            disabled={sendingDigest}
            className={`text-[9px] font-bold border px-4 py-2 transition-all uppercase tracking-widest ${
              sendingDigest
                ? "text-stone-300 border-stone-200 cursor-wait"
                : "text-[#d4b996] border-[#d4b996] hover:bg-[#d4b996] hover:text-white"
            }`}
          >
            {sendingDigest ? "Dispatching..." : "Monthly Digest"}
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="text-[9px] font-bold text-red-700 border border-red-200 px-4 py-2 hover:bg-red-50 transition-all uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT COLUMN: PRODUCT UPLOAD */}
          <div className="lg:col-span-1">
            <h2 className="font-serif text-xl text-[#5c4033] mb-6 uppercase tracking-widest border-b border-stone-100 pb-2">
              Publish Scent
            </h2>
            <ProductForm
              existingProduct={editingProduct}
              onSuccess={() => {
                setEditingProduct(null);
                fetchProducts();
              }}
              onCancel={() => setEditingProduct(null)}
            />
          </div>

          {/* RIGHT COLUMN: ORDERS & MODERATION */}
          <div className="lg:col-span-2 space-y-16">
            {/* ORDERS SECTION */}
            <section>
              <h2 className="font-serif text-xl text-[#5c4033] mb-6 uppercase tracking-widest border-b border-stone-100 pb-2">
                Order Ledger
              </h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-stone-200 p-6 shadow-sm flex justify-between items-start hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest ${order.status === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {order.status || "Processing"}
                        </span>
                        <h4 className="font-serif text-lg">
                          {order.customer_name}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500 tracking-wide uppercase">
                        {order.phone} — {order.city}
                      </p>
                      <p className="text-sm italic text-stone-600">
                        Items: {order.product_name}
                      </p>
                    </div>
                    <div className="text-right space-y-3">
                      <p className="font-bold text-lg">
                        Rs. {order.total_price}
                      </p>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "Completed")
                          }
                          className="text-[10px] font-bold text-green-600 hover:underline uppercase tracking-tighter"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-[10px] font-bold text-red-400 hover:text-red-700 uppercase tracking-tighter"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* LIVE INVENTORY + BROADCAST */}
            <section>
              <h2 className="font-serif text-xl text-[#5c4033] mb-6 uppercase tracking-widest border-b border-stone-100 pb-2">
                Live Inventory & Circle Broadcast
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-stone-200 p-4 flex flex-col justify-between text-center group"
                  >
                    <div>
                      <img
                        src={p.image_url}
                        className="w-full aspect-square object-cover mb-3 bg-stone-50 grayscale hover:grayscale-0 transition-all duration-500"
                      />
                      <h5 className="font-serif text-sm truncate uppercase tracking-wider">
                        {p.name}
                      </h5>
                      <p className="text-[10px] text-stone-400 mt-1">
                        Rs. {p.price}
                      </p>
                    </div>

                    <div className="space-y-2 mt-4">
                      <button
                        onClick={() => handleBroadcast(p)}
                        disabled={broadcastingId === p.id}
                        className={`w-full py-2 text-[9px] font-bold uppercase tracking-widest transition-all border ${
                          broadcastingId === p.id
                            ? "bg-stone-100 text-stone-400 border-stone-100 cursor-not-allowed"
                            : "bg-[#5c4033] text-white border-[#5c4033] hover:bg-white hover:text-[#5c4033]"
                        }`}
                      >
                        {broadcastingId === p.id
                          ? "Notifying..."
                          : "Announce to Circle"}
                      </button>

                      <div className="flex justify-center gap-4 pt-2 border-t border-stone-50">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="text-[9px] font-bold text-stone-400 hover:text-black uppercase tracking-tighter"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="text-[9px] font-bold text-red-300 hover:text-red-600 uppercase tracking-tighter"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* COMMENT MODERATOR */}
            <section>
              <h2 className="font-serif text-xl text-[#5c4033] mb-6 uppercase tracking-widest border-b border-stone-100 pb-2">
                Global Moderation
              </h2>
              <div className="bg-white border border-stone-200 divide-y divide-stone-100">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 flex justify-between items-center group"
                  >
                    <div className="max-w-[80%]">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        {comment.user_email || "Anonymous"}
                      </p>
                      <p className="text-sm text-stone-800 italic mt-1">
                        "{comment.text}"
                      </p>
                    </div>
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 text-[10px] font-bold border border-red-100 px-3 py-1 bg-red-50 uppercase"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="p-8 text-center text-stone-400 text-sm">
                    No comments to moderate.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENT: PRODUCT FORM ---
function ProductForm({ existingProduct, onSuccess, onCancel }: any) {
  const [pData, setPData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Men",
    image_url: "",
    images: [],
  });
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingProduct) setPData(existingProduct);
  }, [existingProduct]);

  const uploadFile = async (file: File) => {
    const fileName = `${Math.random()}-${file.name}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);
    if (error) throw error;
    return supabase.storage.from("product-images").getPublicUrl(fileName).data
      .publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let mainUrl = pData.image_url;
      let gallUrls = pData.images || [];

      if (featuredFile) mainUrl = await uploadFile(featuredFile);
      if (galleryFiles.length > 0) {
        const uploaded = await Promise.all(
          galleryFiles.map((f) => uploadFile(f)),
        );
        gallUrls = [...gallUrls, ...uploaded];
      }

      const autoSlug = pData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const payload = {
        ...pData,
        slug: autoSlug,
        image_url: mainUrl,
        images: gallUrls,
        price: parseInt(pData.price as any),
      };

      const { error } = existingProduct?.id
        ? await supabase
            .from("products")
            .update(payload)
            .eq("id", existingProduct.id)
        : await supabase.from("products").insert([payload]);

      if (error) throw error;

      alert("Vault Updated Successfully 🏛️");
      onSuccess();
      window.location.reload();
    } catch (err: any) {
      alert("Vault Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200 p-6 space-y-4 shadow-sm"
    >
      <input
        placeholder="Product Name"
        value={pData.name}
        className="w-full p-3 border border-stone-100 outline-none focus:border-stone-400 bg-stone-50 text-sm"
        onChange={(e) => setPData({ ...pData, name: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Price (PKR)"
        value={pData.price}
        className="w-full p-3 border border-stone-100 outline-none focus:border-stone-400 bg-stone-50 text-sm"
        onChange={(e) => setPData({ ...pData, price: e.target.value })}
        required
      />
      <select
        value={pData.category}
        className="w-full p-3 border border-stone-100 bg-stone-50 text-sm"
        onChange={(e) => setPData({ ...pData, category: e.target.value })}
      >
        <option>Men</option>
        <option>Women</option>
        <option>Unisex</option>
      </select>
      <textarea
        placeholder="Scent Notes / Description"
        value={pData.description}
        className="w-full p-3 border border-stone-100 bg-stone-50 h-24 text-sm"
        onChange={(e) => setPData({ ...pData, description: e.target.value })}
      />

      <div className="space-y-2">
        <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
          Featured Image
        </label>
        <input
          type="file"
          onChange={(e) => setFeaturedFile(e.target.files?.[0] || null)}
          className="text-[10px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
          Gallery (Up to 4)
        </label>
        <input
          type="file"
          multiple
          onChange={(e) =>
            setGalleryFiles(Array.from(e.target.files || []).slice(0, 4))
          }
          className="text-[10px]"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black text-white py-4 uppercase text-[10px] font-bold tracking-[0.3em]"
        >
          {loading
            ? "Syncing..."
            : existingProduct
              ? "Update Entry"
              : "Publish Scent"}
        </button>
        {existingProduct && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-stone-100 px-4 text-[10px] uppercase font-bold"
          >
            X
          </button>
        )}
      </div>
    </form>
  );
}
