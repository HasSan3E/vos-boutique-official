"use client";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react"; // Add these imports

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    cartTotal,
    updateQuantity,
    itemCount,
  } = useCart();

  const router = useRouter();

  return (
    <>
      {/* Dark Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-500 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2
                className="text-2xl text-[#5c4033] italic"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Your Selection
              </h2>
              {itemCount > 0 && (
                <p
                  className="text-[10px] text-[#8c786a] uppercase tracking-widest mt-1"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {itemCount} {itemCount === 1 ? "Item" : "Items"}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-stone-400 hover:text-black uppercase text-[10px] tracking-widest"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Close
            </button>
          </div>

          {/* VIEW: THE SHOPPING BAG LIST */}
          <div className="flex-1 overflow-y-auto space-y-8">
            {cart.length === 0 ? (
              <p
                className="text-stone-400 text-[10px] uppercase tracking-[0.2em] text-center mt-20"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                The bag is empty
              </p>
            ) : (
              cart.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 border-b border-stone-100 pb-6"
                >
                  <div className="w-20 h-24 bg-stone-100">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className="text-lg italic text-[#5c4033]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-[10px] text-[#8c786a] uppercase tracking-widest mb-2"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {item.category}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-6 h-6 border border-[#d4b996] flex items-center justify-center hover:bg-[#5c4033] hover:text-white transition-all disabled:opacity-30"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span
                        className="text-sm font-bold w-4 text-center"
                        style={{ fontFamily: "'Lato', sans-serif" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-6 h-6 border border-[#d4b996] flex items-center justify-center hover:bg-[#5c4033] hover:text-white transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p
                      className="text-[11px] text-[#5c4033] font-bold tracking-wider mb-2"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-[9px] text-red-800 uppercase tracking-widest hover:underline"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Total Bar */}
          {cart.length > 0 && (
            <div className="border-t border-stone-200 pt-8 mt-auto">
              <div className="flex justify-between mb-2">
                <span
                  className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Subtotal
                </span>
                <span
                  className="text-xl text-[#5c4033] font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
              <p
                className="text-[9px] text-[#8c786a] text-center mb-4"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Shipping & taxes calculated at checkout
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/checkout");
                }}
                className="w-full bg-[#5c4033] text-white py-5 text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-black transition-all shadow-lg"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
