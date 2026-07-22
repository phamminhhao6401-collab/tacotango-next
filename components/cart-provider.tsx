"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import type { TacoItem, Ingredient } from "@/lib/menu-data";

export type CartLine = TacoItem & { 
  cartId: string; 
  quantity: number; 
  selectedIngredients: Ingredient[] 
};

type CartContextValue = {
  items: CartLine[];
  addItem: (item: TacoItem, selectedIngredients: Ingredient[]) => void;
  removeItem: (cartId: string) => void;
  increment: (cartId: string) => void;
  decrement: (cartId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isMounted: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "taco-tango-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setItems(Array.isArray(parsed) ? parsed.map((item: any) => ({
          ...item,
          selectedIngredients: Array.isArray(item.selectedIngredients) ? item.selectedIngredients : []
        })) : []);
      } catch { setItems([]); }
    }
  }, []);

  useEffect(() => {
    if (isMounted) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isMounted]);

  const addItem = useCallback((item: TacoItem, selectedIngredients: Ingredient[]) => {
    // Bắn GA4 event mỗi khi khách thêm món vào giỏ
    const ingPrice = selectedIngredients.reduce((s, i) => s + i.price, 0);
    sendGAEvent("event", "add_to_cart", {
      currency: "VND",
      value: item.price + ingPrice,
      items: [{
        item_id: item.id,
        item_name: item.name,
        price: item.price + ingPrice,
        quantity: 1,
      }],
    });

    setItems((prev) => {
      const cartId = `${item.id}-${selectedIngredients.map(i => i.id).sort().join(",")}`;
      const existing = prev.find((line) => line.cartId === cartId);
      if (existing) {
        return prev.map((line) => line.cartId === cartId ? { ...line, quantity: line.quantity + 1 } : line);
      }
      return [...prev, { ...item, cartId, quantity: 1, selectedIngredients }];
    });
  }, []);

  const totalItems = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items]);

  const subtotal = useMemo(() => items.reduce((sum, line) => {
    // Lấy giá từng ingredient từ mảng selectedIngredients và cộng dồn
    const ingPrice = (line.selectedIngredients || []).reduce((s, i) => s + i.price, 0);
    return sum + line.quantity * (line.price + ingPrice);
  }, 0), [items]);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem: (id) => setItems(prev => prev.filter(i => i.cartId !== id)), 
      increment: (id) => setItems(prev => prev.map(i => i.cartId === id ? {...i, quantity: i.quantity + 1} : i)), 
      decrement: (id) => setItems(prev => prev.map(i => i.cartId === id ? {...i, quantity: Math.max(1, i.quantity - 1)} : i)), 
      clearCart: () => setItems([]), 
      totalItems,
      subtotal, 
      isMounted 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext)!;