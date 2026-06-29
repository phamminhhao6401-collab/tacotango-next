"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, CheckCircle2, Trash2, X, Upload } from "lucide-react";
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
  
  const [deliverySlot, setDeliverySlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [fileMessage, setFileMessage] = useState("");
  
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0]);
      setFileMessage(`Đã chọn: ${e.target.files[0].name}`);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (paymentMethod === "Bank" && !paymentFile) {
      setFileMessage("Vui lòng tải ảnh xác nhận chuyển khoản!");
      return;
    }
    setIsSubmitting(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("phone", form.phone);
    data.append("district", form.district);
    data.append("address", form.address);
    data.append("note", form.note);
    data.append("deliverySlot", deliverySlot);
    data.append("paymentMethod", paymentMethod);
    data.append("items", JSON.stringify(items));
    data.append("subtotal", subtotal.toString());
    data.append("shippingFee", shippingFee.toString());
    data.append("total", total.toString());
    if (paymentFile) data.append("paymentFile", paymentFile);

    try {
      const res = await fetch('/api/send-email', { method: 'POST', body: data });
      if (res.ok) { clearCart(); setOrderPlaced(true); } else { alert("Lỗi gửi đơn!"); setIsSubmitting(false); }
    } catch { alert("Lỗi kết nối!"); setIsSubmitting(false); }
  }

  if (!isMounted) return <div className="min-h-screen bg-mustard p-20 text-center">Đang tải...</div>;
  if (orderPlaced) return (
    <div className="min-h-screen bg-mustard flex flex-col items-center justify-center text-center p-6">
      <CheckCircle2 size={64} className="text-tomato mb-4"/>
      <h1 className="text-3xl text-blue font-saigon2 mb-8">ĐẶT HÀNG THÀNH CÔNG!</h1>
      <Link href="/#menu" className="bg-blue text-mustard px-8 py-4 rounded-full font-bold text-lg hover:bg-tomato transition-colors">Tiếp tục mua hàng</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-mustard">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16 grid lg:grid-cols-2 gap-10">
        <section className="flex flex-col gap-4">
          {items.length > 0 ? (
            <>
              {items.map((line) => (
                <div key={line.cartId} className="p-4 border-3 border-blue bg-cream rounded-2xl flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-blue/20">
                    <Image src={line.image || "/images/placeholder.png"} alt={line.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start font-bold text-blue">
                      <h3>{line.name}</h3>
                      <button onClick={() => removeItem(line.cartId)} className="text-tomato"><Trash2 size={18} /></button>
                    </div>
                    {(line.selectedIngredients || []).map((ing: any) => (
                      <p key={ing.id} className="text-xs text-tomato font-medium mt-1">+ {ing.name} ({formatVND(ing.price)})</p>
                    ))}
                    <div className="flex items-center justify-between mt-3 text-blue">
                      <span className="text-sm font-bold">{formatVND(line.price)}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => decrement(line.cartId)} className="p-1 border rounded"><Minus size={14}/></button>
                        <span>{line.quantity}</span>
                        <button type="button" onClick={() => increment(line.cartId)} className="p-1 border rounded"><Plus size={14}/></button>
                      </div>
                    </div>
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
              <Link href="/#menu" className="bg-tomato text-white px-8 py-3 rounded-full font-bold hover:bg-blue transition-colors">Vẫn còn đói? Xem menu tiếp nhé.</Link>
            </div>
          )}
        </section>
        
        <form onSubmit={handleSubmit} className="bg-mustard p-6 rounded-2xl border-3 border-blue flex flex-col gap-4">
          {/* ... (các trường form giữ nguyên) ... */}
          <input required placeholder="Họ và tên" onChange={e => setForm({...form, name: e.target.value})} className="p-3 rounded-lg border-2 border-blue" />
          <input required type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} className="p-3 rounded-lg border-2 border-blue" />
          <input required placeholder="Số điện thoại" onChange={e => setForm({...form, phone: e.target.value})} className="p-3 rounded-lg border-2 border-blue" />
          <select required onChange={e => setForm({...form, district: e.target.value})} className="p-3 rounded-lg border-2 border-blue">
            <option value="">Chọn Quận/Huyện</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <textarea required placeholder="Địa chỉ chi tiết" onChange={e => setForm({...form, address: e.target.value})} className="p-3 rounded-lg border-2 border-blue" />
          <select required onChange={e => setDeliverySlot(e.target.value)} className="p-3 rounded-lg border-2 border-blue">
            <option value="">Chọn khung giờ ship</option>
            <option value="15:00-16:00">Chiều: 3pm - 4pm</option>
            <option value="18:00-19:00">Tối: 6pm - 7pm</option>
          </select>
          <select required onChange={e => {setPaymentMethod(e.target.value); setFileMessage("");}} className="p-3 rounded-lg border-2 border-blue">
            <option value="">Chọn phương thức thanh toán</option>
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
            <option value="Bank">Chuyển khoản ngân hàng</option>
          </select>

          {paymentMethod === "Bank" && (
            <div className="p-4 border-2 border-blue rounded-xl bg-cream space-y-3">
              <p className="font-bold text-blue text-sm uppercase">Thông tin chuyển khoản:</p>
              <div className="relative w-40 h-40 mx-auto border-2 border-blue rounded-lg overflow-hidden">
                <Image src="/images/qr.jpg" alt="QR" fill className="object-cover" />
              </div>
              <div className="text-sm text-blue space-y-1">
                <p><span className="font-bold">Chủ TK:</span> Huỳnh Phương Nghi</p>
                <p><span className="font-bold">Ngân hàng:</span> MB Bank</p>
                <p><span className="font-bold">Số TK:</span> 9704229200644961996</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-blue text-mustard px-4 py-2 rounded-lg text-sm w-max mx-auto hover:bg-blue/90 transition-colors">
                <Upload size={16} /> Tải ảnh xác nhận
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              {fileMessage && (
                <p className={`text-xs text-center font-bold ${paymentFile ? "text-green-700" : "text-tomato"}`}>
                  {fileMessage}
                </p>
              )}
            </div>
          )}
          <button type="submit" disabled={isSubmitting} className="p-4 rounded-full font-bold bg-tomato text-white">
            {isSubmitting ? "Đang gửi..." : "Xác nhận đặt hàng"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}