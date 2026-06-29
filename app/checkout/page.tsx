"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, CheckCircle2, Trash2, X, Upload } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatVND } from "@/lib/menu-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const DISTRICTS = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 10",
  "Quận 11",
  "Bình Thạnh",
  "Gò Vấp",
  "Phú Nhuận",
  "Tân Bình",
  "Quận 9",
  "Thủ Đức",
  "Nhà Bè",
];

const SHIPPING_FEE = 10000;
const FREE_SHIPPING_THRESHOLD = 150000;

const UEH_FREE_SHIPPING_SLOT = "T5_0207_1500_1530_UEH";
const THU_DUC_REQUIRED_SLOT = "T6_0307_1800_1900";

const DELIVERY_SLOTS = [
  {
    value: "T5_0207_1000_1100",
    label: "T5 (02/07): 10:00 am - 11:00 am",
  },
  {
    value: UEH_FREE_SHIPPING_SLOT,
    label:
      "T5 (02/07): 3:00 pm - 3:30 pm - Chỉ dành cho sinh viên UEH tại cơ sở B Nguyễn Tri Phương",
  },
  {
    value: "T6_0307_1500_1600",
    label: "T6 (03/07): 3:00 pm - 4:00 pm",
  },
  {
    value: THU_DUC_REQUIRED_SLOT,
    label: "T6 (03/07): 6:00 pm - 7:00 pm",
  },
];

export default function CheckoutPage() {
  const {
    items,
    increment,
    decrement,
    removeItem,
    subtotal,
    clearCart,
    isMounted,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    address: "",
    note: "",
  });

  const [deliverySlot, setDeliverySlot] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [fileMessage, setFileMessage] = useState("");

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isThuDucDistrict = form.district === "Thủ Đức";

  const availableDeliverySlots = isThuDucDistrict
    ? DELIVERY_SLOTS.filter((slot) => slot.value === THU_DUC_REQUIRED_SLOT)
    : DELIVERY_SLOTS;

  const selectedDeliverySlot = DELIVERY_SLOTS.find(
    (slot) => slot.value === deliverySlot
  );

  const isUEHFreeShippingSlot = deliverySlot === UEH_FREE_SHIPPING_SLOT;
  const isThuDucRequiredSlot =
    isThuDucDistrict && deliverySlot === THU_DUC_REQUIRED_SLOT;

  const isFreeShipping =
    isUEHFreeShippingSlot || subtotal >= FREE_SHIPPING_THRESHOLD;

  const shippingFee = isFreeShipping ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const handleDistrictChange = (district: string) => {
    setForm((prev) => ({
      ...prev,
      district,
    }));

    if (district === "Thủ Đức") {
      setDeliverySlot(THU_DUC_REQUIRED_SLOT);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0]);
      setFileMessage(`Đã chọn: ${e.target.files[0].name}`);
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (items.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    if (form.district === "Thủ Đức" && deliverySlot !== THU_DUC_REQUIRED_SLOT) {
      alert(
        "Khách ở Thủ Đức chỉ có thể nhận hàng vào T6 (03/07): 6:00 pm - 7:00 pm."
      );
      return;
    }

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

    data.append("deliverySlot", selectedDeliverySlot?.label || deliverySlot);
    data.append("paymentMethod", paymentMethod);

    data.append("isUEHFreeShippingSlot", isUEHFreeShippingSlot ? "Có" : "Không");
    data.append("isThuDucRequiredSlot", isThuDucRequiredSlot ? "Có" : "Không");

    if (isUEHFreeShippingSlot) {
      data.append(
        "shippingDiscountReason",
        "Miễn phí ship cho sinh viên UEH có mặt tại cơ sở B - Nguyễn Tri Phương vào T5 (02/07), 3:00 pm - 3:30 pm"
      );
    }

    if (isThuDucRequiredSlot) {
      data.append(
        "deliveryRestrictionNote",
        "Khách ở Thủ Đức chỉ nhận hàng vào T6 (03/07), 6:00 pm - 7:00 pm"
      );
    }

    data.append("items", JSON.stringify(items));
    data.append("subtotal", subtotal.toString());
    data.append("shippingFee", shippingFee.toString());
    data.append("total", total.toString());

    if (paymentFile) {
      data.append("paymentFile", paymentFile);
    }

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        clearCart();
        setOrderPlaced(true);
      } else {
        alert("Lỗi gửi đơn!");
        setIsSubmitting(false);
      }
    } catch {
      alert("Lỗi kết nối!");
      setIsSubmitting(false);
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-mustard p-20 text-center">
        Đang tải...
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-mustard flex flex-col items-center justify-center text-center p-6">
        <CheckCircle2 size={64} className="text-tomato mb-4" />

        <h1 className="text-3xl text-blue font-saigon2 mb-8">
          ĐẶT HÀNG THÀNH CÔNG!
        </h1>

        <Link
          href="/#menu"
          className="bg-blue text-mustard px-8 py-4 rounded-full font-bold text-lg hover:bg-tomato transition-colors"
        >
          Tiếp tục mua hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mustard">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-16 grid lg:grid-cols-2 gap-10">
        <section className="flex flex-col gap-4">
          {items.length > 0 ? (
            <>
              {items.map((line) => (
                <div
                  key={line.cartId}
                  className="p-4 border-3 border-blue bg-cream rounded-2xl flex items-center gap-4"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-blue/20">
                    <Image
                      src={line.image || "/images/placeholder.png"}
                      alt={line.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start font-bold text-blue">
                      <h3>{line.name}</h3>

                      <button
                        type="button"
                        onClick={() => removeItem(line.cartId)}
                        className="text-tomato"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {(line.selectedIngredients || []).map((ing: any) => (
                      <p
                        key={ing.id}
                        className="text-xs text-tomato font-medium mt-1"
                      >
                        + {ing.name} ({formatVND(ing.price)})
                      </p>
                    ))}

                    <div className="flex items-center justify-between mt-3 text-blue">
                      <span className="text-sm font-bold">
                        {formatVND(line.price)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decrement(line.cartId)}
                          className="p-1 border rounded"
                        >
                          <Minus size={14} />
                        </button>

                        <span>{line.quantity}</span>

                        <button
                          type="button"
                          onClick={() => increment(line.cartId)}
                          className="p-1 border rounded"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-5 bg-blue text-mustard rounded-2xl">
                <p>Tạm tính: {formatVND(subtotal)}</p>

                <p>
                  Phí ship:{" "}
                  {shippingFee === 0
                    ? isUEHFreeShippingSlot
                      ? "Miễn phí - UEH cơ sở B"
                      : "Miễn phí"
                    : formatVND(SHIPPING_FEE)}
                </p>

                {isUEHFreeShippingSlot && (
                  <p className="text-xs mt-1 text-cream/90">
                    Bạn đã chọn khung giờ dành cho sinh viên UEH tại cơ sở B -
                    Nguyễn Tri Phương. Phí ship đã được tự động miễn.
                  </p>
                )}

                {isThuDucRequiredSlot && (
                  <p className="text-xs mt-1 text-cream/90">
                    Bạn đang chọn khu vực Thủ Đức. Khung nhận hàng áp dụng là T6
                    (03/07): 6:00 pm - 7:00 pm.
                  </p>
                )}

                <p className="text-2xl font-bold text-tomato mt-2">
                  Tổng: {formatVND(total)}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 border-3 border-dashed border-blue/30 rounded-2xl text-center">
              <X size={48} className="text-blue/40 mb-4" />

              <h2 className="text-2xl text-blue font-saigon2 mb-6">
                Giỏ hàng đang trống
              </h2>

              <Link
                href="/#menu"
                className="bg-tomato text-white px-8 py-3 rounded-full font-bold hover:bg-blue transition-colors"
              >
                Vẫn còn đói? Xem menu tiếp nhé.
              </Link>
            </div>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="bg-mustard p-6 rounded-2xl border-3 border-blue flex flex-col gap-4"
        >
          <input
            required
            placeholder="Họ và tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-3 rounded-lg border-2 border-blue"
          />

          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-3 rounded-lg border-2 border-blue"
          />

          <input
            required
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="p-3 rounded-lg border-2 border-blue"
          />

          <select
            required
            value={form.district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="p-3 rounded-lg border-2 border-blue"
          >
            <option value="">Chọn Quận/Huyện</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <textarea
            required
            placeholder="Địa chỉ chi tiết"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="p-3 rounded-lg border-2 border-blue"
          />

          <select
            required
            value={deliverySlot}
            onChange={(e) => setDeliverySlot(e.target.value)}
            className="p-3 rounded-lg border-2 border-blue"
          >
            <option value="">Chọn khung giờ ship</option>
            {availableDeliverySlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>

          {isThuDucDistrict && (
            <div className="p-4 rounded-xl border-2 border-blue bg-cream text-blue">
              <p className="font-bold text-sm">
                Khung giờ dành cho khu vực Thủ Đức
              </p>
              <p className="text-xs mt-1 leading-relaxed">
                Khách ở Thủ Đức chỉ nhận hàng vào T6 (03/07): 6:00 pm - 7:00
                pm. Hệ thống đã tự động chọn khung giờ này cho bạn.
              </p>
            </div>
          )}

          {isUEHFreeShippingSlot && (
            <div className="p-4 rounded-xl border-2 border-blue bg-cream text-blue">
              <p className="font-bold text-sm">
                Miễn phí ship cho sinh viên UEH
              </p>
              <p className="text-xs mt-1 leading-relaxed">
                Khung giờ này chỉ dành cho sinh viên UEH có mặt tại cơ sở B -
                Nguyễn Tri Phương vào T5 (02/07), 3:00 pm - 3:30 pm. Phí ship
                đã được tự động trừ khỏi đơn hàng.
              </p>
            </div>
          )}

          <select
            required
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setFileMessage("");
            }}
            className="p-3 rounded-lg border-2 border-blue"
          >
            <option value="">Chọn phương thức thanh toán</option>
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
            <option value="Bank">Chuyển khoản ngân hàng</option>
          </select>

          {paymentMethod === "Bank" && (
            <div className="p-4 border-2 border-blue rounded-xl bg-cream space-y-3">
              <p className="font-bold text-blue text-sm uppercase">
                Thông tin chuyển khoản:
              </p>

              <div className="relative w-40 h-40 mx-auto border-2 border-blue rounded-lg overflow-hidden">
                <Image
                  src="/images/qr.jpg"
                  alt="QR"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-sm text-blue space-y-1">
                <p>
                  <span className="font-bold">Chủ TK:</span> Huỳnh Phương Nghi
                </p>
                <p>
                  <span className="font-bold">Ngân hàng:</span> MB Bank
                </p>
                <p>
                  <span className="font-bold">Số TK:</span> 9704229200644961996
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-blue text-mustard px-4 py-2 rounded-lg text-sm w-max mx-auto hover:bg-blue/90 transition-colors">
                <Upload size={16} /> Tải ảnh xác nhận
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>

              {fileMessage && (
                <p
                  className={`text-xs text-center font-bold ${
                    paymentFile ? "text-green-700" : "text-tomato"
                  }`}
                >
                  {fileMessage}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="p-4 rounded-full font-bold bg-tomato text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang gửi..." : "Xác nhận đặt hàng"}
          </button>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}