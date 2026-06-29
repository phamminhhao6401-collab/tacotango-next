import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // 1. Nhận dữ liệu dưới dạng FormData vì có file ảnh
    const formData = await request.formData();
    
    // 2. Trích xuất các trường từ formData
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const district = formData.get("district") as string;
    const address = formData.get("address") as string;
    const note = formData.get("note") as string;
    const deliverySlot = formData.get("deliverySlot") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    const subtotal = parseFloat(formData.get("subtotal") as string);
    const shippingFee = parseFloat(formData.get("shippingFee") as string);
    const total = parseFloat(formData.get("total") as string);
    const items = JSON.parse(formData.get("items") as string);
    const paymentFile = formData.get("paymentFile") as File | null;

    // 3. Chuẩn bị file đính kèm nếu có
    let attachments = [];
    if (paymentFile) {
      const buffer = Buffer.from(await paymentFile.arrayBuffer());
      attachments.push({
        filename: paymentFile.name,
        content: buffer,
      });
    }

    // 4. Gửi email qua Resend
    const data = await resend.emails.send({
      from: "Taco Tango <donhang@tacotango.id.vn>",
      to: [email, "donhang@tacotango.id.vn"],
      subject: "🌮 Xác nhận đơn hàng từ Taco Tango",
      attachments: attachments,
      react: (
        <EmailTemplate 
          name={name} 
          email={email}
          phone={phone}
          district={district}
          address={address} 
          note={note} 
          items={items} 
          subtotal={subtotal} 
          shippingFee={shippingFee}
          total={total}
          deliverySlot={deliverySlot} // Đã thêm
          paymentMethod={paymentMethod} // Đã thêm
        />
      ),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    return NextResponse.json({ error: "Gửi email thất bại" }, { status: 500 });
  }
}