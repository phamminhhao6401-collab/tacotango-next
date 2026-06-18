'use client'

import { useCart } from '@/components/cart-context'
import { formatVND } from '@/lib/menu-data'

export function CartDrawer() {
  const { items, open, setOpen, subtotal, shippingFee, totalAmount } = useCart()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-blue/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card p-6 border-l-2 border-mustard flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading text-2xl text-mustard">Giỏ hàng ({items.length})</h2>
          <button onClick={() => setOpen(false)} className="text-tomato font-bold uppercase">Đóng</button>
        </div>
        
        <div className="flex-1 overflow-y-auto flex flex-col gap-4">
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

        {/* Phần tổng tiền - Phí ship */}
        {items.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-mustard/30 text-mustard font-mono space-y-2">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí ship:</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold mt-2">
              <span>Tổng cộng:</span>
              <span>{formatVND(totalAmount)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}