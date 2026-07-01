import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

const SHIPPING_FEE = 10000;
const FREE_SHIPPING_THRESHOLD = 150000;

const VALID_PROMO_CODES = ["BANBE", "NGUOITHAN"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const district = String(formData.get("district") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const note = String(formData.get("note") || "").trim();
    const deliverySlot = String(formData.get("deliverySlot") || "").trim();
    const paymentMethod = String(formData.get("paymentMethod") || "").trim();

    const promoCode = String(formData.get("promoCode") || "")
      .trim()
      .toUpperCase();

    const isPromoValid = VALID_PROMO_CODES.includes(promoCode);

    const isUEHFreeShippingSlot = String(
      formData.get("isUEHFreeShippingSlot") || "Không"
    );

    const isThuDucRequiredSlot = String(
      formData.get("isThuDucRequiredSlot") || "Không"
    );

    const shippingDiscountReason = String(
      formData.get("shippingDiscountReason") || ""
    );

    const deliveryRestrictionNote = String(
      formData.get("deliveryRestrictionNote") || ""
    );

    const subtotal = Number(formData.get("subtotal") || 0);

    const rawItems = String(formData.get("items") || "[]");

    let items: any[] = [];

    try {
      items = JSON.parse(rawItems);
    } catch {
      return NextResponse.json(
        { error: "Dữ liệu giỏ hàng không hợp lệ" },
        { status: 400 }
      );
    }

    if (
      !name ||
      !email ||
      !phone ||
      !district ||
      !address ||
      !deliverySlot ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { error: "Thiếu thông tin đặt hàng bắt buộc" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Giỏ hàng đang trống" },
        { status: 400 }
      );
    }

    if (district === "Thủ Đức" && !deliverySlot.includes("6:00 pm - 7:00 pm")) {
      return NextResponse.json(
        {
          error:
            "Khách ở Thủ Đức chỉ có thể nhận hàng vào T6 (03/07): 6:00 pm - 7:00 pm",
        },
        { status: 400 }
      );
    }

    const paymentFile = formData.get("paymentFile");

    if (paymentMethod === "Bank" && !(paymentFile instanceof File)) {
      return NextResponse.json(
        { error: "Vui lòng tải ảnh xác nhận chuyển khoản" },
        { status: 400 }
      );
    }

    const attachments: {
      filename: string;
      content: Buffer;
    }[] = [];

    if (paymentFile instanceof File && paymentFile.size > 0) {
      const buffer = Buffer.from(await paymentFile.arrayBuffer());

      attachments.push({
        filename: paymentFile.name || "xac-nhan-chuyen-khoan.jpg",
        content: buffer,
      });
    }

    const isSubtotalFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const isUEHFreeShipping = isUEHFreeShippingSlot === "Có";

    const isFreeShipping =
      isSubtotalFreeShipping || isUEHFreeShipping || isPromoValid;

    const shippingFee = isFreeShipping ? 0 : SHIPPING_FEE;
    const total = subtotal + shippingFee;

    let promoDiscountReason = "";

    if (isPromoValid) {
      promoDiscountReason = `Miễn phí ship bằng mã ${promoCode}`;
    }

    const extraNotes = [
      note,
      isUEHFreeShipping && shippingDiscountReason
        ? `Ưu đãi ship: ${shippingDiscountReason}`
        : "",
      isPromoValid && promoDiscountReason
        ? `Ưu đãi mã freeship: ${promoDiscountReason}`
        : "",
      isSubtotalFreeShipping
        ? `Ưu đãi ship: Đơn hàng từ 150.000đ nên được miễn phí ship`
        : "",
      isThuDucRequiredSlot === "Có" && deliveryRestrictionNote
        ? `Ghi chú giao hàng: ${deliveryRestrictionNote}`
        : "",
    ].filter(Boolean);

    const finalNote =
      extraNotes.length > 0 ? extraNotes.join("\n\n") : "Không có ghi chú";

    const data = await resend.emails.send({
      from: "Taco Tango <donhang@tacotango.id.vn>",
      to: [email, "donhang@tacotango.id.vn"],
      subject: "🌮 Xác nhận đơn hàng từ Taco Tango",
      attachments,
      react: (
        <EmailTemplate
          name={name}
          email={email}
          phone={phone}
          district={district}
          address={address}
          note={finalNote}
          items={items}
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
          deliverySlot={deliverySlot}
          paymentMethod={paymentMethod}
        />
      ),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Lỗi gửi email:", error);

    return NextResponse.json(
      { error: "Gửi email thất bại" },
      { status: 500 }
    );
  }
}