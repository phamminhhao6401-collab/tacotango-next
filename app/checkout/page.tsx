"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, CheckCircle2, ArrowLeft } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatVND } from "@/lib/menu-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const INITIAL_FORM: FormState = { name: "", email: "", phone: "", address: "" };

export default function CheckoutPage() {
  const { items, increment, decrement, removeItem, subtotal, clearCart, isMounted } =
    useCart();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);

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

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          items: items,
          subtotal: subtotal
        }),
      });

      if (!response.ok) throw new Error("Gửi email thất bại");

      clearCart();
      setOrderPlaced(true);
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi đặt hàng, vui lòng thử lại!");
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-mustard">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center font-saigon3 text-blue sm:px-6">
          Đang tải giỏ hàng…
        </main>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-mustard">
        <SiteHeader />
        <main className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
          <span className="grid h-20 w-20 place-items-center rounded-full border-3 border-blue bg-tomato shadow-retro">
            <CheckCircle2 className="h-10 w-10 text-cream" strokeWidth={2.5} />
          </span>
          <h1 className="font-saigon3 text-3xl text-blue sm:text-4xl">
            Đặt hàng thành công!
          </h1>
          <p className="max-w-md font-saigon3 text-base text-blue">
            Bếp đang nóng lên rồi. Chúng tôi đã gửi email xác nhận và sẽ liên hệ qua số điện thoại bạn để lại để giao taco nóng hổi.
          </p>
          <Link
            href="/"
            className="mt-2 flex items-center gap-2 rounded-full border-3 border-blue bg-blue px-6 py-3 font-saigon3 text-sm font-bold uppercase tracking-wide text-mustard shadow-tomato transition-transform hover:-translate-y-1"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Về trang chủ gọi thêm món
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mustard">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col gap-3">
          <span className="font-saigon3 text-xs font-bold uppercase tracking-[0.3em] text-tomato">
            Xác nhận đặt hàng
          </span>
          <h1 className="font-saigon2 text-3xl text-blue sm:text-4xl">
            Giỏ hàng của bạn
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border-3 border-blue bg-cream p-10 text-center font-saigon3 text-blue shadow-retro">
            <p>Giỏ hàng đang trống. Hãy chọn vài món taco trước khi quay lại đây.</p>
            <Link
              href="/#menu"
              className="mt-6 inline-flex rounded-full border-3 border-blue bg-blue px-6 py-3 font-saigon3 text-sm font-bold uppercase tracking-wide text-mustard"
            >
              Xem thực đơn
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section aria-label="Danh sách món đã chọn" className="flex flex-col gap-4">
              {items.map((line) => (
                <article
                  key={line.id}
                  className="flex items-center gap-4 rounded-2xl border-3 border-blue bg-cream p-4 shadow-retro-sm"
                >
                  <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-full border-3 border-blue bg-mustard text-2xl">
                    {line.emoji}
                  </span>

                  <div className="flex-1">
                    <h3 className="font-saigon3 text-base text-blue">{line.name}</h3>
                    <p className="font-saigon3 text-sm text-tomato">
                      {formatVND(line.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrement(line.id)}
                      aria-label={`Giảm số lượng ${line.name}`}
                      className="grid h-8 w-8 place-items-center rounded-full border-2 border-blue text-blue hover:bg-blue hover:text-mustard"
                    >
                      <Minus className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                    <span className="w-6 text-center font-saigon3 font-bold text-blue">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(line.id)}
                      aria-label={`Tăng số lượng ${line.name}`}
                      className="grid h-8 w-8 place-items-center rounded-full border-2 border-blue text-blue hover:bg-blue hover:text-mustard"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(line.id)}
                    aria-label={`Xóa ${line.name} khỏi giỏ`}
                    className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border-2 border-blue text-blue hover:border-tomato hover:text-tomato"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </article>
              ))}

              <div className="flex items-center justify-between rounded-2xl border-3 border-blue bg-blue p-5 font-mono text-mustard">
                <span className="font-saigon3 text-lg uppercase tracking-wide">
                  Tổng cộng
                </span>
                <span className="font-saigon2 text-2xl text-tomato">
                  {formatVND(subtotal)}
                </span>
              </div>
            </section>

            <section aria-label="Thông tin giao hàng">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 rounded-2xl border-3 border-blue bg-mustard p-6 shadow-retro sm:p-8"
              >
                <h2 className="font-saigon2 text-xl text-blue">
                  Thông tin nhận hàng
                </h2>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="font-saigon2 text-xs font-bold uppercase tracking-wide text-blue">
                    Họ và tên
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    className="rounded-xl border-3 border-blue bg-cream px-4 py-3 font-saigon3 text-sm text-blue placeholder:text-blue/40 focus:outline-none"
                  />
                  {errors.name && (
                    <span className="font-saigon3 text-xs text-tomato">{errors.name}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-saigon2 text-xs font-bold uppercase tracking-wide text-blue">
                    Địa chỉ Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="khachhang@example.com"
                    className="rounded-xl border-3 border-blue bg-cream px-4 py-3 font-saigon3 text-sm text-blue placeholder:text-blue/40 focus:outline-none"
                  />
                  {errors.email && (
                    <span className="font-saigon3 text-xs text-tomato">{errors.email}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="font-saigon2 text-xs font-bold uppercase tracking-wide text-blue">
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="0901 234 567"
                    className="rounded-xl border-3 border-blue bg-cream px-4 py-3 font-saigon3 text-sm text-blue placeholder:text-blue/40 focus:outline-none"
                  />
                  {errors.phone && (
                    <span className="font-saigon3 text-xs text-tomato">{errors.phone}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="font-saigon2 text-xs font-bold uppercase tracking-wide text-blue">
                    Địa chỉ giao hàng
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Số nhà, đường, quận, ghi chú độ cay..."
                    className="rounded-xl border-3 border-blue bg-cream px-4 py-3 font-saigon3 text-sm text-blue placeholder:text-blue/40 focus:outline-none"
                  />
                  {errors.address && (
                    <span className="font-saigon3 text-xs text-tomato">{errors.address}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-2 rounded-full border-3 border-blue bg-tomato px-6 py-3.5 font-saigon3 text-sm font-bold uppercase tracking-wide text-cream shadow-retro-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Xác nhận đặt hàng
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