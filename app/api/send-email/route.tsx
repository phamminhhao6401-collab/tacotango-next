import * as React from "react";
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
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Thiếu RESEND_API_KEY trên server" },
        { status: 500 }
      );
    }

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

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Email khách hàng không hợp lệ" },
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
            "Khách ở Thủ Đức chỉ có thể nhận hàng vào khung 6:00 pm - 7:00 pm mỗi ngày.",
        },
        { status: 400 }
      );
    }

    const paymentFile = formData.get("paymentFile");

    if (paymentMethod === "Bank") {
      if (!(paymentFile instanceof File) || paymentFile.size === 0) {
        return NextResponse.json(
          { error: "Vui lòng tải ảnh xác nhận chuyển khoản" },
          { status: 400 }
        );
      }
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
    const isFreeShipping = isSubtotalFreeShipping || isPromoValid;

    const shippingFee = isFreeShipping ? 0 : SHIPPING_FEE;
    const total = subtotal + shippingFee;

    const promoDiscountReason = isPromoValid
      ? `Miễn phí ship bằng mã ${promoCode}`
      : "";

    const extraNotes = [
      note,
      isPromoValid && promoDiscountReason
        ? `Ưu đãi mã freeship: ${promoDiscountReason}`
        : "",
      isSubtotalFreeShipping
        ? "Ưu đãi ship: Đơn hàng từ 150.000đ nên được miễn phí ship"
        : "",
      isThuDucRequiredSlot === "Có" && deliveryRestrictionNote
        ? `Ghi chú giao hàng: ${deliveryRestrictionNote}`
        : "",
    ].filter(Boolean);

    const finalNote =
      extraNotes.length > 0 ? extraNotes.join("\n\n") : "Không có ghi chú";

    const result = await resend.emails.send({
      from: "Taco Tango <donhang@tacotango.id.vn>",
      to: [email, "donhang@tacotango.id.vn"],
      subject: "🌮 Xác nhận đơn hàng từ Taco Tango",
      attachments,
      react: React.createElement(EmailTemplate, {
        name,
        email,
        phone,
        district,
        address,
        note: finalNote,
        items,
        subtotal,
        shippingFee,
        total,
        deliverySlot,
        paymentMethod,
        isThuDucRequiredSlot,
        shippingDiscountReason,
        deliveryRestrictionNote,
        promoCode,
        isPromoApplied: isPromoValid ? "Có" : "Không",
        promoDiscountReason,
      }),
    });

    if (result.error) {
      return NextResponse.json(
        {
          error: "Gửi email thất bại",
          detail:
            result.error.message ||
            JSON.stringify(result.error) ||
            "Lỗi không xác định từ Resend",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Lỗi gửi email:", error);

    const detail =
      error instanceof Error ? error.message : "Lỗi không xác định";

    return NextResponse.json(
      {
        error: "Gửi email thất bại",
        detail,
      },
      { status: 500 }
    );
  }
}