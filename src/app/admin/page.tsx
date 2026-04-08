"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]); // New State for Claims
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
        // Fetching all data including the new claims
        await Promise.all([
          fetchOrders(),
          fetchProducts(),
          fetchComments(),
          fetchClaims(),
        ]);
        setLoading(false);
      }
    };
    initDashboard();

    // --- REALTIME SUBSCRIPTION FOR CLAIMS ---
    const claimsChannel = supabase
      .channel("realtime-claims")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "claims" },
        (payload) => {
          // Live update: Adds the new claim to the top of the list
          setClaims((prev) => [payload.new, ...prev]);
          // Optional: You can add a sound notification here
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(claimsChannel);
    };
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

  // --- NEW: FETCH CLAIMS ---
  async function fetchClaims() {
    const { data } = await supabase
      .from("claims")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setClaims(data);
  }

  // --- ACTIONS ---
  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (!error) {
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    } else {
      alert("Error: " + error.message);
    }
  };

  const deleteOrder = async (id: string) => {
    if (confirm("Archive this order permanently?")) {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (!error) {
        setOrders(orders.filter((o) => o.id !== id));
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  const deleteComment = async (id: string) => {
    if (confirm("Remove this comment?")) {
      await supabase.from("comments").delete().eq("id", id);
      setComments(comments.filter((c) => c.id !== id));
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Delete this scent from the vault?")) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Error: " + error.message);
      }
    }
  };

  // --- NEW: DELETE CLAIM ---
  const deleteClaim = async (id: string) => {
    if (confirm("Resolve and remove this claim?")) {
      await supabase.from("claims").delete().eq("id", id);
      setClaims(claims.filter((c) => c.id !== id));
    }
  };

  // --- BROADCAST LOGIC ---
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
      if (res.ok) alert("The Circle has been notified. 🏛️");
    } finally {
      setBroadcastingId(null);
    }
  };

  const handleMonthlyDigest = async () => {
    if (!confirm("Dispatch the Monthly Edit digest to all subscribers?"))
      return;
    setSendingDigest(true);
    try {
      const res = await fetch("/api/admin/monthly", { method: "POST" });
      if (res.ok) alert("Monthly Digest dispatched! 🏛️");
    } finally {
      setSendingDigest(false);
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
            className={`text-[9px] font-bold border px-4 py-2 transition-all uppercase tracking-widest ${sendingDigest ? "text-stone-300 border-stone-200 cursor-wait" : "text-[#d4b996] border-[#d4b996] hover:bg-[#d4b996] hover:text-white"}`}
          >
            {sendingDigest ? "Dispatching..." : "Monthly Digest"}
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="text-[9px] font-bold text-red-700 border border-red-200 px-4 py-2 hover:bg-red-50 uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
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

          <div className="lg:col-span-2 space-y-16">
            {/* --- NEW: LIVE CLAIMS LEDGER --- */}
            <section>
              <h2 className="font-serif text-xl text-[#5c4033] mb-6 uppercase tracking-[0.2em] border-b border-[#d4b996] pb-2 flex justify-between items-center">
                Return & Exchange Claims
                <span className="text-[9px] bg-[#d4b996] text-white px-2 py-1 rounded-full animate-pulse">
                  LIVE
                </span>
              </h2>
              <div className="space-y-4">
                {claims.length === 0 && (
                  <p className="text-xs text-stone-400 italic">
                    No pending claims in the Vault.
                  </p>
                )}
                {claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="bg-white border-l-4 border-[#5c4033] border-y border-r border-stone-200 p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif text-lg text-[#5c4033]">
                          {claim.name} —{" "}
                          <span className="text-stone-400">
                            Order {claim.order_id}
                          </span>
                        </h4>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                          Contact: {claim.contact_number}
                        </p>
                        <p className="text-sm text-stone-700 mt-4 leading-relaxed font-light bg-stone-50 p-3 italic">
                          "{claim.complaint}"
                        </p>
                      </div>
                      <div className="text-right">
                        {claim.attachment_url ? (
                          <a
                            href={claim.attachment_url}
                            target="_blank"
                            className="inline-block bg-[#d4b996] text-white text-[9px] font-bold px-4 py-2 uppercase tracking-widest hover:bg-black transition-colors"
                          >
                            View Evidence 🎞️
                          </a>
                        ) : (
                          <span className="text-[9px] text-stone-300 uppercase">
                            No File
                          </span>
                        )}
                        <button
                          onClick={() => deleteClaim(claim.id)}
                          className="block w-full mt-4 text-[9px] text-red-300 hover:text-red-600 font-bold uppercase tracking-widest"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ORDER LEDGER */}
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
                    <div className="space-y-1 max-w-[70%]">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest ${order.status === "Completed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {order.status || "Processing"}
                        </span>
                        <h4 className="font-serif text-lg">
                          Order #{order.id.toString().slice(0, 8).toUpperCase()}{" "}
                          — {order.customer_name}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500 uppercase">
                        {order.phone} — {order.city}
                      </p>
                      <p className="text-[11px] text-[#5c4033] font-medium bg-stone-50 p-2 rounded border border-stone-100 mt-2">
                        📍 {order.address || "Address Missing"}
                      </p>
                      <p className="text-sm italic text-stone-600 mt-2">
                        Scent:{" "}
                        <span className="font-bold">{order.product_name}</span>
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
                          className="text-[10px] font-bold text-green-600 hover:underline uppercase"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="text-[10px] font-bold text-red-400 hover:text-red-700 uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* LIVE INVENTORY */}
            <section>
              <h2 className="font-serif text-xl text-[#5c4033] mb-6 uppercase tracking-widest border-b border-stone-100 pb-2">
                Live Inventory & Circle Broadcast
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-stone-200 p-4 flex flex-col justify-between text-center group shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <img
                        src={p.image_url}
                        className="w-full aspect-square object-cover mb-3 bg-stone-50 grayscale hover:grayscale-0 transition-all duration-500"
                        alt={p.name}
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
                        className={`w-full py-2 text-[9px] font-bold uppercase tracking-widest border ${broadcastingId === p.id ? "bg-stone-100 text-stone-400 border-stone-100 cursor-not-allowed" : "bg-[#5c4033] text-white border-[#5c4033] hover:bg-white hover:text-[#5c4033]"}`}
                      >
                        {broadcastingId === p.id
                          ? "Notifying..."
                          : "Announce to Circle"}
                      </button>
                      <div className="flex justify-center gap-4 pt-2 border-t border-stone-50">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="text-[9px] font-bold text-stone-400 hover:text-black uppercase"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="text-[9px] font-bold text-red-300 hover:text-red-600 uppercase"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* MODERATION */}
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
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENT: PRODUCT FORM (UNALTERED) ---
function ProductForm({ existingProduct, onSuccess, onCancel }: any) {
  const [pData, setPData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Men",
    image_url: "",
    images: [] as string[],
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

      const payload = {
        ...pData,
        price: parseInt(pData.price as any),
        image_url: mainUrl,
        images: gallUrls,
        slug: pData.name.toLowerCase().replace(/\s+/g, "-"),
      };
      const { error } = existingProduct?.id
        ? await supabase
            .from("products")
            .update(payload)
            .eq("id", existingProduct.id)
        : await supabase.from("products").insert([payload]);

      if (error) throw error;
      alert("Vault Updated! 🏛️");
      onSuccess();
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
        className="w-full p-3 border border-stone-100 bg-stone-50 text-sm"
        onChange={(e) => setPData({ ...pData, name: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Price (PKR)"
        value={pData.price}
        className="w-full p-3 border border-stone-100 bg-stone-50 text-sm"
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
        placeholder="Scent Notes"
        value={pData.description}
        className="w-full p-3 border border-stone-100 bg-stone-50 h-24 text-sm"
        onChange={(e) => setPData({ ...pData, description: e.target.value })}
      />
      <div>
        <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
          Featured Image
        </label>
        <input
          type="file"
          onChange={(e) => setFeaturedFile(e.target.files?.[0] || null)}
          className="text-[10px] block mt-1"
        />
      </div>
      <div>
        <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
          Gallery (Up to 4)
        </label>
        <input
          type="file"
          multiple
          onChange={(e) =>
            setGalleryFiles(Array.from(e.target.files || []).slice(0, 4))
          }
          className="text-[10px] block mt-1"
        />
      </div>
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-black text-white py-4 uppercase text-[10px] font-bold tracking-[0.3em]"
        >
          {loading ? "Syncing..." : "Publish Scent"}
        </button>
        {existingProduct && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-stone-100 px-4 text-black"
          >
            X
          </button>
        )}
      </div>
    </form>
  );
}
