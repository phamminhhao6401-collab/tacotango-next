'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { MenuItem } from '@/lib/menu-data'

const CartContext = createContext<any>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([])
  const [open, setOpen] = useState(false)

  const addItem = (item: MenuItem) => {
    setItems((prev) => [...prev, item])
  }

  // Định nghĩa hàm để Header gọi
  const openCart = () => setOpen(true)
  const closeCart = () => setOpen(false)

  return (
    <CartContext.Provider value={{ items, addItem, count: items.length, open, setOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)