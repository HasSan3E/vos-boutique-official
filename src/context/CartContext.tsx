"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

// Define proper types
interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string;
  size?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  // Updated type to accept an optional quantity number
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  itemCount: number;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // FIXED: Added 'amount' parameter which defaults to 1
  const addToCart = useCallback(
    (product: Omit<CartItem, "quantity">, amount: number = 1) => {
      setCart((prev) => {
        // Check if item already exists in cart
        const existingIndex = prev.findIndex((item) => item.id === product.id);

        if (existingIndex >= 0) {
          // Item exists - increase by the specific amount passed
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + amount,
          };
          return updated;
        } else {
          // New item - add with the specific amount passed
          return [...prev, { ...product, quantity: amount }];
        }
      });

      // Automatically open cart when adding
      setIsCartOpen(true);
    },
    [],
  );

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity < 1) return;

    setCart((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], quantity };
      }
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        itemCount,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
