"use client";

import { useState } from "react";
import { Minus, Plus, CheckCircle2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatVND } from "@/lib/menu-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const DISTRICTS = ["Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12", "Bình Tân", "Bình Thạnh", "Gò Vấp", "Phú Nhuận", "Tân Bình", "Tân Phú", "Quận 2", "Quận 9", "Thủ Đức", "Bình Chánh", "Cần Giờ", "Củ Chi", "Hóc Môn", "Nhà Bè"];
const SHIPPING_FEE = 10000;
const FREE_SHIPPING_THRESHOLD = 150000;

export default function CheckoutPage() {
  const { items, increment, decrement, subtotal, clearCart, isMounted } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", district: "", address: "", note: "" });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ ...form, items, subtotal, shippingFee, total }) });
    if (res.ok) { clearCart(); setOrderPlaced(true); } else alert("Lỗi gửi đơn!");
  }

  if (!isMounted) return <div className="min-h-screen bg-mustard p-20 text-center">Đang tải...</div>;
  if (orderPlaced) return <div className="min-h-screen bg-mustard flex flex-col items-center justify-center text-center"><CheckCircle2 size={64} className="text-tomato"/><h1 className="text-3xl text-blue font-saigon2">Đặt hàng thành công!</h1></div>;

  return (
    <div className="min-h-screen bg-mustard">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16 grid lg:grid-cols-2 gap-10">
        <section className="flex flex-col gap-4">
          {items.map((line) => (
            <div key={line.cartId} className="p-4 border-3 border-blue bg-cream rounded-2xl">
              <div className="flex justify-between font-bold text-blue">
                <h3>{line.name}</h3>
                <span className="text-sm opacity-70">{formatVND(line.price)}</span>
              </div>
              {(line.selectedIngredients || []).map(ing => <p key={ing.id} className="text-xs text-tomato">+ {ing.name} ({formatVND(ing.price)})</p>)}
              <div className="flex items-center gap-2 mt-3 text-blue">
                <button onClick={() => decrement(line.cartId)} className="p-1 border rounded"><Minus size={14}/></button>
                <span>{line.quantity}</span>
                <button onClick={() => increment(line.cartId)} className="p-1 border rounded"><Plus size={14}/></button>
              </div>
            </div>
          ))}
          <div className="p-5 bg-blue text-mustard rounded-2xl">
            <p>Tạm tính: {formatVND(subtotal)}</p>
            <p>Phí ship: {shippingFee === 0 ? "Miễn phí" : formatVND(SHIPPING_FEE)}</p>
            <p className="text-2xl font-bold text-tomato">Tổng: {formatVND(total)}</p>
          </div>
        </section>
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
          <button type="submit" className="bg-tomato text-white p-4 rounded-full font-bold">Xác nhận đặt hàng</button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}