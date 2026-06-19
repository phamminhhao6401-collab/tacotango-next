"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { TacoItem } from "@/lib/menu-data";

export type CartLine = TacoItem & { quantity: number };

type CartContextValue = {
  items: CartLine[];
  addItem: (item: TacoItem) => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
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
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write errors
    }
  }, [items, isMounted]);

  const addItem = useCallback((item: TacoItem) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.id === item.id);
      if (existing) {
        return prev.map((line) =>
          line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const increment = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, quantity: line.quantity + 1 } : line
      )
    );
  }, []);

  const decrement = useCallback((id: string) => {
    setItems((prev) =>
      prev
        .map((line) =>
          line.id === id ? { ...line, quantity: line.quantity - 1 } : line
        )
        .filter((line) => line.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity * line.price, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    increment,
    decrement,
    clearCart,
    totalItems,
    subtotal,
    isMounted,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
