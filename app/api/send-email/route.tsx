import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, note, items, subtotal } = body;

    const data = await resend.emails.send({
      // Dùng mail mặc định để không cần xác thực domain ngay bây giờ
      from: "Taco Tango <donhang@tacotango.id.vn>",
      // Gửi cho cả khách hàng và địa chỉ Gmail quản lý của bạn
      to: [email, "donhang@tacotango.id.vn"],
      subject: "🌮 Xác nhận đơn hàng từ Taco Tango",
      // Sử dụng cú pháp JSX đúng chuẩn
      react: (
        <EmailTemplate 
          name={name} 
          items={items} 
          subtotal={subtotal} 
          phone={phone} 
          address={address} 
          note={note} 
        />
      ),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Lỗi gửi email:", error); // Thêm log để dễ kiểm tra lỗi
    return NextResponse.json({ error: "Gửi email thất bại" }, { status: 500 });
  }
}