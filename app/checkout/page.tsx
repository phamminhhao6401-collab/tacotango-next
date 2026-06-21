"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, CheckCircle2, ArrowLeft } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatVND } from "@/lib/menu-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useState, type FormEvent } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  note: string;
};

const INITIAL_FORM: FormState = { name: "", email: "", phone: "", address: "", note: "" };

export default function CheckoutPage() {
  const { items, increment, decrement, removeItem, subtotal, clearCart, isMounted } =
    useCart();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: Partial<FormState> = {};
    if (!form.name.trim()) nextErrors.name = "Vui lòng nhập tên người nhận.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Email không hợp lệ.";
    }
    if (!/^[0-9+\s]{8,12}$/.test(form.phone.trim()))
      nextErrors.phone = "Số điện thoại không hợp lệ.";
    if (!form.address.trim()) nextErrors.address = "Vui lòng nhập địa chỉ giao hàng.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, subtotal }),
      });
      if (!response.ok) throw new Error("Gửi email thất bại");
      clearCart();
      setOrderPlaced(true);
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isMounted) return <div className="min-h-screen bg-mustard"><SiteHeader /><main className="mx-auto max-w-3xl px-4 py-20 text-center font-saigon3 text-blue">Đang tải...</main></div>;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-mustard">
        <SiteHeader />
        <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full border-3 border-blue bg-tomato shadow-retro">
            <CheckCircle2 className="h-10 w-10 text-cream" />
          </span>
          <h1 className="font-saigon2 text-3xl tracking-wider text-blue">Đặt hàng thành công!</h1>
          <p className="font-saigon3 text-base tracking-wide text-blue">Chúng tôi đã gửi email xác nhận.</p>
          <Link href="/" className="mt-2 flex items-center gap-2 rounded-full border-3 border-blue bg-blue px-6 py-3 font-saigon3 text-sm font-bold tracking-wider text-mustard transition-transform hover:-translate-y-1">
            <ArrowLeft className="h-4 w-4" /> Về trang chủ
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mustard">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-10 flex flex-col gap-3">
          <span className="font-saigon3 text-xs font-bold uppercase tracking-[0.3em] text-tomato">Xác nhận đặt hàng</span>
          <h1 className="font-saigon2 text-3xl tracking-wider text-blue">Giỏ hàng của bạn</h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border-3 border-blue bg-cream p-10 text-center font-saigon3 text-blue shadow-retro">
            <p>Giỏ hàng đang trống.</p>
            <Link href="/#menu" className="mt-6 inline-flex rounded-full border-3 border-blue bg-blue px-6 py-3 font-saigon3 text-sm font-bold tracking-wider text-mustard">Xem thực đơn</Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="flex flex-col gap-4">
              {items.map((line) => (
                <article key={line.id} className="flex items-center gap-4 rounded-2xl border-3 border-blue bg-cream p-4 shadow-retro-sm">
                  <span className="grid h-14 w-14 place-items-center rounded-full border-3 border-blue bg-mustard text-2xl">{line.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-saigon3 text-base tracking-wide text-blue">{line.name}</h3>
                    <p className="font-saigon3 text-sm tracking-wide text-tomato">{formatVND(line.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => decrement(line.id)} className="grid h-8 w-8 place-items-center rounded-full border-2 border-blue text-blue"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-6 text-center font-saigon3 font-bold text-blue">{line.quantity}</span>
                    <button type="button" onClick={() => increment(line.id)} className="grid h-8 w-8 place-items-center rounded-full border-2 border-blue text-blue"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button type="button" onClick={() => removeItem(line.id)} className="grid h-9 w-9 place-items-center rounded-full border-2 border-blue text-blue"><Trash2 className="h-4 w-4" /></button>
                </article>
              ))}
              <div className="flex items-center justify-between rounded-2xl border-3 border-blue bg-blue p-5 text-mustard">
                <span className="font-saigon3 text-lg tracking-wider">Tổng cộng</span>
                <span className="font-saigon2 text-2xl tracking-wider text-tomato">{formatVND(subtotal)}</span>
              </div>
            </section>

            <section>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border-3 border-blue bg-mustard p-6 shadow-retro">
                <h2 className="font-saigon2 text-xl tracking-wider text-blue">Thông tin nhận hàng</h2>
                {["name", "email", "phone", "address", "note"].map((field) => (
                  <div key={field} className="flex flex-col gap-1.5">
                    <label htmlFor={field} className="font-saigon3 text-sm font-bold tracking-wider text-blue">
                      {field === "name" ? "Họ và tên" : field === "email" ? "Địa chỉ Email" : field === "phone" ? "Số điện thoại" : field === "address" ? "Địa chỉ giao hàng" : "Ghi chú thêm"}
                    </label>
                    {field === "address" || field === "note" ? (
                      <textarea id={field} rows={field === "address" ? 3 : 2} value={form[field as keyof FormState]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} className="rounded-xl border-3 border-blue bg-cream px-4 py-3 font-mono text-sm text-blue focus:outline-none normal-case" />
                    ) : (
                      <input id={field} type={field === "email" ? "email" : "text"} value={form[field as keyof FormState]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} className="rounded-xl border-3 border-blue bg-cream px-4 py-3 font-mono text-sm text-blue focus:outline-none normal-case" />
                    )}
                    {errors[field as keyof FormState] && <span className="font-mono text-sm text-tomato">{errors[field as keyof FormState]}</span>}
                  </div>
                ))}
                <button type="submit" disabled={isSubmitting} className="mt-2 rounded-full border-3 border-blue bg-tomato px-6 py-3.5 font-saigon3 text-sm font-bold tracking-wider text-cream shadow-retro-sm transition-transform hover:-translate-y-0.5">
                  {isSubmitting ? "Đang gửi..." : "Xác nhận đặt hàng"}
                </button>
              </form>
            </section>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}