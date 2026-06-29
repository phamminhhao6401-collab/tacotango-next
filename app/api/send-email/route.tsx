import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const district = String(formData.get("district") || "");
    const address = String(formData.get("address") || "");
    const note = String(formData.get("note") || "");
    const deliverySlot = String(formData.get("deliverySlot") || "");
    const paymentMethod = String(formData.get("paymentMethod") || "");

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
    const shippingFee = Number(formData.get("shippingFee") || 0);
    const total = Number(formData.get("total") || 0);

    const rawItems = String(formData.get("items") || "[]");

    let items = [];

    try {
      items = JSON.parse(rawItems);
    } catch {
      return NextResponse.json(
        { error: "Dữ liệu giỏ hàng không hợp lệ" },
        { status: 400 }
      );
    }

    if (!name || !email || !phone || !district || !address || !deliverySlot) {
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

    const extraNotes = [
      note,
      isUEHFreeShippingSlot === "Có" && shippingDiscountReason
        ? `Ưu đãi ship: ${shippingDiscountReason}`
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