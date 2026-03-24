"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Lock,
  Shield,
  Truck,
  CheckCircle,
  CreditCard,
  MapPin,
  Phone,
  User,
  ChevronRight,
  Package,
  Clock,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string;
  quantity: number;
}

export default function CheckoutPage() {
  const { cart, cartTotal, setCart, itemCount } = useCart() as {
    cart: CartItem[];
    cartTotal: number;
    setCart: (cart: CartItem[]) => void;
    itemCount: number;
  };

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "COD",
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const router = useRouter();

  const shippingFee = 250;
  const grandTotal = cartTotal + shippingFee;

  // --- VALIDATION LOGIC ---
  const isFormValid =
    formData.name.trim().length >= 3 &&
    formData.phone.trim().length >= 11 &&
    formData.address.trim().length >= 10 &&
    formData.city.trim().length >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return; // Final safety check

    setLoading(true);

    const productDetails = cart
      .map((item) => `${item.name} (x${item.quantity})`)
      .join(", ");

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        items: cart,
        product_name: productDetails,
        payment_method: formData.paymentMethod,
        total_price: grandTotal,
        item_count: itemCount,
      },
    ]);

    if (!error) {
      setOrderComplete(true);
      setTimeout(() => {
        setCart([]);
        router.push("/");
      }, 3000);
    } else {
      alert("Error: " + error.message);
    }
    setLoading(false);
  };

  const steps = [
    { id: 1, label: "Information" },
    { id: 2, label: "Shipping" },
    { id: 3, label: "Payment" },
  ];

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-[#f5f2f0] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <Package className="w-16 h-16 text-[#d4b996] mx-auto mb-6" />
          <h2
            className="text-3xl text-[#5c4033] italic mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your Collection Awaits
          </h2>
          <p
            className="text-[#8c786a] text-sm mb-8 font-light"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Your fragrance selection is currently empty. Discover our sovereign
            collection.
          </p>
          <button
            onClick={() => router.push("/shop")}
            className="bg-[#5c4033] text-[#f5f2f0] px-8 py-4 text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-black transition-all flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Collection
          </button>
        </motion.div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#f5f2f0] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg bg-white p-12 border border-[#d4b996]"
        >
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
          <h2
            className="text-3xl text-[#5c4033] italic mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Order Victorious
          </h2>
          <p className="text-[#8c786a] text-sm mb-2 font-light">
            Your sovereign scents have been secured.
          </p>
          <p className="text-[#5c4033] text-xs uppercase tracking-widest font-bold">
            We will contact you shortly via WhatsApp
          </p>
          <div className="mt-8 pt-8 border-t border-[#d4b996]">
            <p className="text-[10px] text-[#8c786a] uppercase tracking-widest">
              Redirecting to homepage...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f5f2f0]"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      <header className="w-full py-6 bg-white border-b border-[#d4b996]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/shop")}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8c786a] hover:text-[#5c4033] transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#8c786a] font-bold">
            <Lock className="w-3 h-3" /> Secure
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-[#d4b996]/30 py-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${currentStep >= step.id ? "bg-[#5c4033] text-white" : "bg-[#d4b996]/30 text-[#8c786a]"}`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-[9px] uppercase tracking-wider mt-2 font-bold ${currentStep >= step.id ? "text-[#5c4033]" : "text-[#8c786a]"}`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-[2px] mx-4 transition-all ${currentStep > step.id ? "bg-[#5c4033]" : "bg-[#d4b996]/30"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-200px)]">
        <div className="flex-1 p-8 lg:p-16">
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#5c4033] flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#5c4033]">
                    Contact Details
                  </h3>
                  <p className="text-[10px] text-[#8c786a]">
                    For order updates & delivery
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-4 bg-white border border-[#d4b996]/50 outline-none focus:border-[#5c4033] text-sm pl-12"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c786a]" />
                </div>
                <div className="relative">
                  <input
                    required
                    type="tel"
                    placeholder="WhatsApp Number (e.g. 03001234567)"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full p-4 bg-white border border-[#d4b996]/50 outline-none focus:border-[#5c4033] text-sm pl-12"
                  />
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c786a]" />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#5c4033] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#5c4033]">
                    Shipping Address
                  </h3>
                  <p className="text-[10px] text-[#8c786a]">
                    Nationwide delivery across Pakistan
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-[#faf9f6] border border-[#d4b996]/30 flex items-center gap-3">
                  <span className="text-2xl">🇵🇰</span>
                  <div>
                    <p className="text-sm font-bold text-[#5c4033]">Pakistan</p>
                    <p className="text-[10px] text-[#8c786a]">
                      All provinces & territories
                    </p>
                  </div>
                </div>
                <textarea
                  required
                  placeholder="House Number, Street, Sector/Area"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full p-4 bg-white border border-[#d4b996]/50 outline-none focus:border-[#5c4033] text-sm resize-none"
                />
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="City (e.g. Rawalpindi, Karachi, Lahore)"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full p-4 bg-white border border-[#d4b996]/50 outline-none focus:border-[#5c4033] text-sm pl-12"
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c786a]" />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#5c4033] flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#5c4033]">
                    Payment Method
                  </h3>
                  <p className="text-[10px] text-[#8c786a]">
                    Secure & encrypted
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {["COD", "Digital"].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center p-5 border-2 cursor-pointer transition-all ${formData.paymentMethod === method ? "border-[#5c4033] bg-[#faf9f6]" : "border-[#d4b996]/30 bg-white"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${formData.paymentMethod === method ? "border-[#5c4033]" : "border-[#d4b996]"}`}
                    >
                      {formData.paymentMethod === method && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#5c4033]" />
                      )}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <span className="text-sm font-bold text-[#5c4033] uppercase tracking-wider">
                          {method === "COD"
                            ? "Cash on Delivery"
                            : "Digital Payment"}
                        </span>
                        <p className="text-[10px] text-[#8c786a] mt-1">
                          {method === "COD"
                            ? "Pay when you receive"
                            : "JazzCash / EasyPaisa"}
                        </p>
                      </div>
                      {method === "COD" ? (
                        <Truck className="w-5 h-5 text-[#8c786a]" />
                      ) : (
                        <div className="flex gap-2">
                          <span className="text-[8px] bg-green-100 p-1 rounded">
                            EasyPaisa
                          </span>
                          <span className="text-[8px] bg-red-100 p-1 rounded">
                            JazzCash
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={() =>
                        setFormData({ ...formData, paymentMethod: method })
                      }
                      className="hidden"
                    />
                  </label>
                ))}
              </div>
            </section>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full lg:hidden py-5 text-[11px] tracking-[0.4em] uppercase font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${loading || !isFormValid ? "bg-stone-300 cursor-not-allowed text-stone-500" : "bg-[#5c4033] text-white hover:bg-black"}`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Complete Order <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-[450px] bg-white border-l border-[#d4b996]/30 p-8 lg:p-12">
          <div className="sticky top-32">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#5c4033] mb-8 pb-4 border-b-2 border-[#5c4033]">
              Order Summary
            </h3>
            <div className="space-y-6 max-h-[50vh] overflow-y-auto mb-8 pr-2">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 bg-[#faf9f6] p-4 border border-[#d4b996]/30"
                >
                  <div className="relative w-20 h-24">
                    <img
                      src={item.image_url}
                      className="w-full h-full object-cover"
                      alt={item.name}
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#5c4033] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        className="text-sm italic text-[#5c4033]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {item.name}
                      </h4>
                      <p className="text-[9px] text-[#8c786a] uppercase font-bold tracking-wider">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-[#8c786a]">
                        Rs. {item.price.toLocaleString()} × {item.quantity}
                      </span>
                      <span className="text-sm font-bold text-[#5c4033]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4 pt-6 border-t-2 border-[#d4b996]/30">
              <div className="flex justify-between text-[11px] font-bold text-[#8c786a] uppercase tracking-widest">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-[#8c786a] uppercase tracking-widest">
                <span>Shipping</span>
                <span>Rs. {shippingFee}</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8c786a] tracking-widest">
                    Total
                  </span>
                  <span className="text-[10px] text-[#8c786a]">
                    Including Taxes
                  </span>
                </div>
                <span
                  className="text-3xl text-[#5c4033] font-bold italic"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || !isFormValid}
              className={`hidden lg:flex w-full mt-8 py-5 text-[11px] tracking-[0.4em] uppercase font-bold transition-all items-center justify-center gap-2 shadow-lg ${loading || !isFormValid ? "bg-stone-300 cursor-not-allowed text-stone-500" : "bg-[#5c4033] text-white hover:bg-black"}`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Complete Order <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
