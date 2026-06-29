"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, CheckCircle2, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatVND } from "@/lib/menu-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const DISTRICTS = ["Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12", "Bình Tân", "Bình Thạnh", "Gò Vấp", "Phú Nhuận", "Tân Bình", "Tân Phú", "Quận 2", "Quận 9", "Thủ Đức", "Bình Chánh", "Cần Giờ", "Củ Chi", "Hóc Môn", "Nhà Bè"];
const SHIPPING_FEE = 10000;
const FREE_SHIPPING_THRESHOLD = 150000;

export default function CheckoutPage() {
  const { items, increment, decrement, removeItem, subtotal, clearCart, isMounted } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", district: "", address: "", note: "" });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/send-email', { 
        method: 'POST', 
        body: JSON.stringify({ ...form, items, subtotal, shippingFee, total }) 
      });
      
      if (res.ok) { 
        clearCart(); 
        setOrderPlaced(true); 
      } else { 
        alert("Lỗi gửi đơn, vui lòng thử lại!"); 
        setIsSubmitting(false);
      }
    } catch { 
      alert("Lỗi kết nối, vui lòng thử lại!"); 
      setIsSubmitting(false); 
    }
  }

  if (!isMounted) return <div className="min-h-screen bg-mustard p-20 text-center">Đang tải...</div>;
  
  if (orderPlaced) return (
    <div className="min-h-screen bg-mustard flex flex-col items-center justify-center text-center p-6">
      <CheckCircle2 size={64} className="text-tomato mb-4"/>
      <h1 className="text-3xl text-blue font-saigon2 mb-8">ĐẶT HÀNG THÀNH CÔNG!</h1>
      <Link 
        href="/#menu" 
        className="bg-blue text-mustard px-8 py-4 rounded-full font-bold text-lg hover:bg-tomato transition-colors"
      >
        Tiếp tục mua hàng
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-mustard">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16 grid lg:grid-cols-2 gap-10">
        
        {/* CỘT TRÁI: GIỎ HÀNG HOẶC NÚT QUAY LẠI MENU */}
        <section className="flex flex-col gap-4">
          {items.length > 0 ? (
            <>
              {items.map((line) => (
                <div key={line.cartId} className="p-4 border-3 border-blue bg-cream rounded-2xl">
                  <div className="flex justify-between items-start font-bold text-blue">
                    <h3>{line.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm opacity-70">{formatVND(line.price)}</span>
                      <button 
                        onClick={() => removeItem(line.cartId)} 
                        className="text-tomato hover:text-blue transition-colors"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {(line.selectedIngredients || []).map(ing => (
                    <p key={ing.id} className="text-xs text-tomato">+ {ing.name} ({formatVND(ing.price)})</p>
                  ))}
                  
                  <div className="flex items-center gap-2 mt-3 text-blue">
                    <button type="button" onClick={() => decrement(line.cartId)} className="p-1 border rounded"><Minus size={14}/></button>
                    <span>{line.quantity}</span>
                    <button type="button" onClick={() => increment(line.cartId)} className="p-1 border rounded"><Plus size={14}/></button>
                  </div>
                </div>
              ))}
              
              <div className="p-5 bg-blue text-mustard rounded-2xl">
                <p>Tạm tính: {formatVND(subtotal)}</p>
                <p>Phí ship: {shippingFee === 0 ? "Miễn phí" : formatVND(SHIPPING_FEE)}</p>
                <p className="text-2xl font-bold text-tomato mt-2">Tổng: {formatVND(total)}</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 border-3 border-dashed border-blue/30 rounded-2xl text-center">
              <X size={48} className="text-blue/40 mb-4" />
              <h2 className="text-2xl text-blue font-saigon2 mb-6">Giỏ hàng đang trống</h2>
              <Link 
                href="/#menu" 
                className="bg-tomato text-white px-8 py-3 rounded-full font-bold hover:bg-blue transition-colors"
              >
                Vẫn còn đói? Xem menu tiếp nhé.
              </Link>
            </div>
          )}
        </section>
        
        {/* CỘT PHẢI: FORM THÔNG TIN */}
        <form onSubmit={handleSubmit} className="bg-mustard p-6 rounded-2xl border-3 border-blue flex flex-col gap-4">
          <input required placeholder="Họ và tên" onChange={e => setForm({...form, name: e.target.value})} className="p-3 rounded-lg border-2 border-blue" />
          <input required type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} className="p-3 rounded-lg border-2 border-blue" />
          <input required placeholder="Số điện thoại" onChange={e => setForm({...form, phone: e.target.value})} className="p-3 rounded-lg border-2 border-blue" />
          <select required onChange={e => setForm({...form, district: e.target.value})} className="p-3 rounded-lg border-2 border-blue">
            <option value="">Chọn Quận/Huyện</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <textarea required placeholder="Địa chỉ chi tiết" onChange={e => setForm({...form, address: e.target.value})} className="p-3 rounded-lg border-2 border-blue" />
          <textarea placeholder="Ghi chú thêm" onChange={e => setForm({...form, note: e.target.value})} className="p-3 rounded-lg border-2 border-blue" />
          
          <button 
            type="submit" 
            disabled={isSubmitting || items.length === 0} 
            className={`p-4 rounded-full font-bold text-white transition-opacity ${isSubmitting || items.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-tomato"}`}
          >
            {isSubmitting ? "Đang gửi đơn..." : "Xác nhận đặt hàng"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}