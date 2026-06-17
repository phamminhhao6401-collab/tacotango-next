'use client'

import { useCart } from '@/components/cart-context'
import { formatVND } from '@/lib/menu-data'

export function CartDrawer() {
  const { items, open, setOpen } = useCart()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-blue/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card p-6 border-l-2 border-mustard">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl text-mustard">Giỏ hàng ({items.length})</h2>
          <button onClick={() => setOpen(false)} className="text-tomato font-bold uppercase">Đóng</button>
        </div>
        
        <div className="flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-cream font-mono">Giỏ hàng của bạn đang trống.</p>
          ) : (
            items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between text-mustard border-b border-mustard/20 pb-2 font-mono">
                <span>{item.name}</span>
                <span>{formatVND(item.price)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}