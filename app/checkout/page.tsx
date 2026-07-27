"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { sendGAEvent } from "@next/third-parties/google";
import {
  Minus,
  Plus,
  CheckCircle2,
  Trash2,
  X,
  Upload,
  Instagram,
  Facebook,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatVND } from "@/lib/menu-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

interface CartIngredient {
  id: string | number;
  name: string;
  price: number;
}

interface CartItem {
  cartId: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedIngredients?: CartIngredient[];
}

interface CheckCodeResponse {
  valid: boolean;
  type: "freeship" | "percent" | null;
  value: number;
  error?: string;
}

interface SendEmailResponse {
  orderId?: string;
  error?: string;
  detail?: string;
}

const DISTRICTS = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 7",
  "Quận 8",
  "Quận 10",
  "Bình Thạnh",
  "Phú Nhuận",
  "Tân Bình",
  "Quận 9",
  "Thủ Đức",
  "Nhà Bè",
];

const SHIPPING_FEE = 10000;
const FREE_SHIPPING_THRESHOLD = 150000;
const MAX_FILE_SIZE_MB = 5;

const THU_DUC_REQUIRED_SLOT_VALUES = [
  "T5_3007_1600_1700",
  "T6_3107_1600_1700",
];

const ORDERS_PAUSED = false;

const DELIVERY_SLOTS = [
  { value: "T5_3007_1100_1200", label: "T5 (30/07): 11:00 am - 12:00 pm" },
  { value: "T5_3007_1600_1700", label: "T5 (30/07): 4:00 pm - 5:00 pm" },
  { value: "T6_3107_1100_1200", label: "T6 (31/07): 11:00 am - 12:00 pm" },
  { value: "T6_3107_1600_1700", label: "T6 (31/07): 4:00 pm - 5:00 pm" },
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

  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoType, setPromoType] = useState<"freeship" | "percent" | null>(null);
  const [promoValue, setPromoValue] = useState(0);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const isThuDucDistrict = form.district === "Thủ Đức";

  const availableDeliverySlots = isThuDucDistrict
    ? DELIVERY_SLOTS.filter((slot) =>
        THU_DUC_REQUIRED_SLOT_VALUES.includes(slot.value)
      )
    : DELIVERY_SLOTS;

  const selectedDeliverySlot = DELIVERY_SLOTS.find(
    (slot) => slot.value === deliverySlot
  );

  const normalizedPromoCode = promoCode.trim().toUpperCase();

  const isThuDucRequiredSlot =
    isThuDucDistrict && THU_DUC_REQUIRED_SLOT_VALUES.includes(deliverySlot);

  const isPromoFreeShipping = isPromoApplied && promoType === "freeship";
  const isPromoPercentDiscount = isPromoApplied && promoType === "percent";
  const isOrderValueFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  const isFreeShipping = isOrderValueFreeShipping || isPromoFreeShipping;

  const shippingFee = isFreeShipping ? 0 : SHIPPING_FEE;
  const percentDiscountAmount = isPromoPercentDiscount
    ? Math.round(subtotal * (promoValue / 100))
    : 0;

  const calculatedTotal = subtotal + shippingFee - percentDiscountAmount;
  const total = calculatedTotal < 0 ? 0 : calculatedTotal;

  const shippingDiscountReasons = [
    isOrderValueFreeShipping
      ? `Miễn phí ship vì đơn hàng từ ${formatVND(FREE_SHIPPING_THRESHOLD)}`
      : "",
    isPromoFreeShipping ? `Miễn phí ship bằng mã ${normalizedPromoCode}` : "",
    isPromoPercentDiscount
      ? `Giảm ${promoValue}% giá trị đơn bằng mã ${normalizedPromoCode}`
      : "",
  ].filter(Boolean);

  const shippingFeeLabel =
    shippingFee === 0
      ? isPromoFreeShipping
        ? `Miễn phí - mã ${normalizedPromoCode}`
        : "Miễn phí"
      : formatVND(SHIPPING_FEE);

  const handleDistrictChange = (district: string) => {
    setFormError("");
    setForm((prev) => ({
      ...prev,
      district,
    }));

    if (
      district === "Thủ Đức" &&
      !THU_DUC_REQUIRED_SLOT_VALUES.includes(deliverySlot)
    ) {
      setDeliverySlot("");
    }
  };

  const handlePromoCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
    if (isPromoApplied) {
      setIsPromoApplied(false);
      setPromoType(null);
      setPromoValue(0);
      setPromoMessage("");
    }
  };

  const handleRemovePromoCode = () => {
    setIsPromoApplied(false);
    setPromoType(null);
    setPromoValue(0);
    setPromoCode("");
    setPromoMessage("");
  };

  const handleApplyPromoCode = async () => {
    setFormError("");
    if (!normalizedPromoCode) {
      setIsPromoApplied(false);
      setPromoMessage("Vui lòng nhập mã.");
      return;
    }

    setIsCheckingPromo(true);
    setPromoMessage("");

    try {
      const res = await fetch("/api/check-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalizedPromoCode }),
      });

      const data: CheckCodeResponse = await res.json();

      if (!res.ok || !data.valid) {
        setIsPromoApplied(false);
        setPromoType(null);
        setPromoMessage(data.error || "Mã không hợp lệ.");
        return;
      }

      setPromoCode(normalizedPromoCode);
      setIsPromoApplied(true);
      setPromoType(data.type);
      setPromoValue(data.value);

      setPromoMessage(
        data.type === "freeship"
          ? `Áp dụng mã ${normalizedPromoCode} thành công - miễn phí ship.`
          : `Áp dụng mã ${normalizedPromoCode} thành công - giảm ${data.value}% giá trị đơn.`
      );
    } catch {
      setIsPromoApplied(false);
      setPromoMessage("Lỗi kết nối, vui lòng thử lại.");
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormError("");
    const file = e.target.files?.[0];

    if (!file) {
      setPaymentFile(null);
      setFileMessage("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPaymentFile(null);
      setFileMessage("");
      setFormError("Vui lòng chọn file hình ảnh (jpeg, png, jpg, v.v.).");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setPaymentFile(null);
      setFileMessage("");
      setFormError(`Dung lượng ảnh tối đa là ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setPaymentFile(file);
    setFileMessage(`Đã chọn: ${file.name}`);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (isSubmitting) return;

    if (!items || items.length === 0) {
      setFormError("Giỏ hàng đang trống!");
      return;
    }

    if (
      form.district === "Thủ Đức" &&
      !THU_DUC_REQUIRED_SLOT_VALUES.includes(deliverySlot)
    ) {
      setFormError(
        "Khách ở Thủ Đức chỉ có thể nhận hàng vào khung 4:00 pm - 5:00 pm mỗi ngày."
      );
      return;
    }

    const phoneRegex = /^(0[35789]|84[35789])[0-9]{8}$/;
    if (!phoneRegex.test(form.phone)) {
      setFormError("Vui lòng nhập số điện thoại Việt Nam hợp lệ.");
      return;
    }

    if (promoCode.trim() !== "" && !isPromoApplied) {
      setFormError(
        "Bạn chưa ấn 'Áp dụng' mã ưu đãi hoặc mã không hợp lệ. Vui lòng kiểm tra lại hoặc xóa mã."
      );
      return;
    }

    if (paymentMethod === "Bank" && !paymentFile) {
      setFormError("Vui lòng tải ảnh xác nhận chuyển khoản!");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("email", form.email);
      data.append("phone", form.phone);
      data.append("district", form.district);
      data.append("address", form.address);
      data.append("note", form.note);

      data.append("deliverySlot", selectedDeliverySlot?.label || deliverySlot);
      data.append("paymentMethod", paymentMethod);

      data.append("isThuDucRequiredSlot", isThuDucRequiredSlot ? "Có" : "Không");
      data.append("isPromoFreeShipping", isPromoFreeShipping ? "Có" : "Không");
      data.append("isPromoPercentDiscount", isPromoPercentDiscount ? "Có" : "Không");
      data.append("promoCode", isPromoApplied ? normalizedPromoCode : "");

      data.append(
        "shippingDiscountReason",
        shippingDiscountReasons.length > 0
          ? shippingDiscountReasons.join(" | ")
          : "Không có"
      );

      if (isThuDucRequiredSlot) {
        data.append(
          "deliveryRestrictionNote",
          "Khách ở Thủ Đức chỉ nhận hàng vào khung 4:00 pm - 5:00 pm mỗi ngày"
        );
      }

      const optimizedItems = items.map((item: CartItem) => ({
        id: item.id || item.cartId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedIngredients: item.selectedIngredients || [],
      }));
      data.append("items", JSON.stringify(optimizedItems));

      data.append("subtotal", subtotal.toString());
      data.append("shippingFee", shippingFee.toString());
      data.append("percentDiscountAmount", percentDiscountAmount.toString());
      data.append("total", total.toString());

      if (paymentFile) {
        data.append("paymentFile", paymentFile);
      }

      const res = await fetch("/api/send-email", {
        method: "POST",
        body: data,
      });

      const responseData: SendEmailResponse = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMessage = responseData.detail
          ? `${responseData.error}: ${responseData.detail}`
          : responseData.error || `Lỗi gửi đơn! Mã lỗi: ${res.status}`;

        setFormError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      const finalOrderId = responseData.orderId || `TT-${Date.now()}`;

      sendGAEvent("event", "purchase", {
        debug_mode: true, 
        currency: "VND",
        value: total,
        transaction_id: finalOrderId,
        shipping: shippingFee,
        coupon: isPromoApplied ? normalizedPromoCode : undefined,
        items: items.map((line: CartItem) => ({
          item_id: line.id || line.cartId,
          item_name: line.name,
          price: line.price,
          quantity: line.quantity,
        })),
      });

      if (isPromoApplied && normalizedPromoCode) {
        fetch("/api/use-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: normalizedPromoCode }),
        }).catch((err) => console.error("Lỗi đánh dấu mã đã dùng:", err));
      }

      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setFormError("Lỗi kết nối! Vui lòng kiểm tra mạng hoặc thử lại sau.");
      setIsSubmitting(false);
    }
  }

  if (ORDERS_PAUSED) {
    return (
      <div className="min-h-screen bg-mustard">
        <SiteHeader />

        <main className="mx-auto max-w-3xl px-4 py-20">
          <section className="bg-cream border-3 border-blue rounded-3xl p-8 md:p-12 text-center shadow-[8px_8px_0px_#1f3c88]">
            <p className="text-tomato font-bold uppercase tracking-widest text-sm mb-4">
              Taco Tango tạm đóng đơn
            </p>

            <h1 className="text-3xl md:text-5xl text-blue font-saigon2 mb-6 leading-tight">
              Chúng mình đã nhận đủ đơn cho đợt này rồi!
            </h1>

            <p className="text-blue text-base md:text-lg leading-relaxed mb-6 font-medium">
              Chúng mình đã nhận đủ số lượng đơn cho đợt này để đảm bảo chất
              lượng ngon nhất. Xin lỗi bạn vì sự bất tiện này nhé!
            </p>

            <div className="bg-mustard border-2 border-blue rounded-2xl p-5 mb-6">
              <p className="text-blue font-bold text-lg">
                Taco Tango sẽ trở lại sớm thôiii
              </p>
            </div>

            <p className="text-tomato font-bold mb-3">
              Nếu bạn đã đặt đơn thành công trước đó, đơn hàng vẫn sẽ được giao
              đúng hẹn.
            </p>

            <p className="text-blue text-sm md:text-base mb-6">
              Theo dõi Instagram/Fanpage để nhận thông báo sớm nhất khi chúng
              mình mở đơn lại.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.instagram.com/tacotango_2026"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue text-mustard px-6 py-3 rounded-full font-bold hover:bg-tomato hover:text-white transition-all w-full sm:w-auto"
              >
                <Instagram className="h-5 w-5" />
                Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61590932327366"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue text-mustard px-6 py-3 rounded-full font-bold hover:bg-tomato hover:text-white transition-all w-full sm:w-auto"
              >
                <Facebook className="h-5 w-5" />
                Fanpage
              </a>
            </div>

            <Link
              href="/"
              className="inline-block mt-8 text-blue font-bold underline underline-offset-4 hover:text-tomato transition-colors"
            >
              Quay lại trang chủ
            </Link>
          </section>
        </main>

        <SiteFooter />
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-mustard p-20 text-center">Đang tải...</div>
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
          {items && items.length > 0 ? (
            <>
              {items.map((line: CartItem) => (
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
                        className="text-tomato disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {(line.selectedIngredients || []).map((ing: CartIngredient) => (
                      <p
                        key={ing.id}
                        className="text-xs text-tomato font-medium mt-1"
                      >
                        + {ing.name}
                        {ing.price > 0 ? ` (${formatVND(ing.price)})` : ""}
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
                          className="p-1 border rounded disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          <Minus size={14} />
                        </button>

                        <span>{line.quantity}</span>

                        <button
                          type="button"
                          onClick={() => increment(line.cartId)}
                          className="p-1 border rounded disabled:opacity-50"
                          disabled={isSubmitting}
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

                <p>Phí ship: {shippingFeeLabel}</p>

                {isPromoPercentDiscount && (
                  <p>
                    Giảm giá ({promoValue}%): -{formatVND(percentDiscountAmount)}
                  </p>
                )}

                {isOrderValueFreeShipping && (
                  <p className="text-xs mt-1 text-cream/90">
                    Đơn hàng từ {formatVND(FREE_SHIPPING_THRESHOLD)} được miễn
                    phí ship.
                  </p>
                )}

                {isPromoFreeShipping && !isOrderValueFreeShipping && (
                  <p className="text-xs mt-1 text-cream/90">
                    Bạn đã áp dụng mã {normalizedPromoCode}. Phí ship đã được tự
                    động miễn.
                  </p>
                )}

                {isPromoPercentDiscount && (
                  <p className="text-xs mt-1 text-cream/90">
                    Bạn đã áp dụng mã {normalizedPromoCode}. Đơn hàng được giảm{" "}
                    {promoValue}%.
                  </p>
                )}

                {isThuDucRequiredSlot && (
                  <p className="text-xs mt-1 text-cream/90">
                    Bạn đang chọn khu vực Thủ Đức. Khung nhận hàng áp dụng là
                    4:00 pm - 5:00 pm.
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
                Đói rồi, chọn Taco thôi!
              </Link>
            </div>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="bg-mustard p-6 rounded-2xl border-3 border-blue flex flex-col gap-4"
        >
          {formError && (
            <div className="p-4 bg-tomato/10 border-2 border-tomato rounded-xl text-tomato font-bold text-sm">
              {formError}
            </div>
          )}

          <input
            required
            placeholder="Họ và tên"
            value={form.name}
            onChange={(e) => {
              setFormError("");
              setForm({ ...form, name: e.target.value });
            }}
            disabled={isSubmitting}
            className="p-3 rounded-lg border-2 border-blue disabled:opacity-60"
          />

          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => {
              setFormError("");
              setForm({ ...form, email: e.target.value });
            }}
            disabled={isSubmitting}
            className="p-3 rounded-lg border-2 border-blue disabled:opacity-60"
          />

          <input
            required
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => {
              setFormError("");
              setForm({ ...form, phone: e.target.value });
            }}
            disabled={isSubmitting}
            className="p-3 rounded-lg border-2 border-blue disabled:opacity-60"
          />

          <select
            required
            value={form.district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={isSubmitting}
            className="p-3 rounded-lg border-2 border-blue disabled:opacity-60"
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
            onChange={(e) => {
              setFormError("");
              setForm({ ...form, address: e.target.value });
            }}
            disabled={isSubmitting}
            className="p-3 rounded-lg border-2 border-blue disabled:opacity-60"
          />

          <select
            required
            value={deliverySlot}
            onChange={(e) => {
              setFormError("");
              setDeliverySlot(e.target.value);
            }}
            disabled={isSubmitting}
            className="p-3 rounded-lg border-2 border-blue disabled:opacity-60"
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
                Khách ở Thủ Đức chỉ nhận hàng vào khung 4:00 pm - 5:00 pm mỗi
                ngày. Vui lòng chọn T5 hoặc T6 trong các khung giờ đang hiển
                thị.
              </p>
            </div>
          )}

          <div className="p-4 border-2 border-blue rounded-xl bg-cream space-y-2">
            <p className="font-bold text-blue text-sm uppercase">Mã ưu đãi</p>

            <div className="flex gap-2">
              <input
                placeholder="Nhập mã ưu đãi nếu có"
                value={promoCode}
                onChange={handlePromoCodeChange}
                disabled={isPromoApplied || isSubmitting || isCheckingPromo}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isPromoApplied) {
                    e.preventDefault();
                    handleApplyPromoCode();
                  }
                }}
                className="p-3 rounded-lg border-2 border-blue flex-grow disabled:opacity-60 disabled:bg-gray-100"
              />

              {isPromoApplied ? (
                <button
                  type="button"
                  onClick={handleRemovePromoCode}
                  disabled={isSubmitting}
                  className="bg-tomato text-white px-4 rounded-lg font-bold hover:bg-tomato/90 transition-colors disabled:opacity-60"
                >
                  Huỷ
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyPromoCode}
                  disabled={
                    isCheckingPromo || isSubmitting || !promoCode.trim()
                  }
                  className="bg-blue text-mustard px-4 rounded-lg font-bold hover:bg-blue/90 transition-colors disabled:opacity-60"
                >
                  {isCheckingPromo ? "Đang kiểm tra..." : "Áp dụng"}
                </button>
              )}
            </div>

            {promoMessage && (
              <p
                className={`text-xs font-bold ${
                  isPromoApplied ? "text-green-700" : "text-tomato"
                }`}
              >
                {promoMessage}
              </p>
            )}
          </div>

          <select
            required
            value={paymentMethod}
            onChange={(e) => {
              setFormError("");
              setPaymentMethod(e.target.value);
              setFileMessage("");

              if (e.target.value !== "Bank") {
                setPaymentFile(null);
              }
            }}
            disabled={isSubmitting}
            className="p-3 rounded-lg border-2 border-blue disabled:opacity-60"
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
                  src="/images/qrmomo.jpg"
                  alt="QR chuyển khoản MoMo"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-sm text-blue space-y-1">
                <p>
                  <span className="font-bold">Chủ TK:</span> NGUYEN LE DUC NHAN
                </p>
                <p>
                  <span className="font-bold">Ngân hàng:</span> MoMo
                </p>
                <p>
                  <span className="font-bold">Số TK:</span> PSG2618315400000015
                </p>
              </div>

              <label
                className={`flex items-center gap-2 cursor-pointer bg-blue text-mustard px-4 py-2 rounded-lg text-sm w-max mx-auto hover:bg-blue/90 transition-colors ${
                  isSubmitting ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                <Upload size={16} /> Tải ảnh xác nhận
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
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
            className="p-4 rounded-full font-bold bg-tomato text-white hover:bg-tomato/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận đặt hàng"
            )}
          </button>
        </form>
      </main>

      <SiteFooter />
    </div>
  );
}