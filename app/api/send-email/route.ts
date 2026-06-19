import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, items, subtotal } = body;

    // 1. Gửi email xác nhận cho KHÁCH HÀNG
    await resend.emails.send({
      from: "Taco Tango <onboarding@resend.dev>", // Dùng mail mặc định của Resend để tránh lỗi cấu hình
      to: email, 
      subject: "🌮 Đơn hàng Taco Tango của bạn đã được xác nhận!",
      html: `
        <h1>Chào ${name}, cảm ơn bạn đã đặt hàng!</h1>
        <p>Bếp Taco Tango đang chuẩn bị đơn hàng của bạn.</p>
        <p><strong>Tổng tiền:</strong> ${subtotal}đ</p>
      `,
    });

    // 2. Gửi email thông báo đơn hàng cho CHÍNH BẠN (Minh Hào)
    await resend.emails.send({
      from: "Taco Tango Notification <onboarding@resend.dev>",
      to: "tacotango2026@gmail.com", // Email cá nhân của bạn
      subject: "🔔 CÓ ĐƠN HÀNG MỚI TỪ TACO TANGO!",
      html: `
        <h1>Đơn hàng mới từ: ${name}</h1>
        <p><strong>SĐT:</strong> ${phone}</p>
        <p><strong>Địa chỉ:</strong> ${address}</p>
        <h3>Danh sách món:</h3>
        <ul>
          ${items.map((i: any) => `<li>${i.name} x ${i.quantity}</li>`).join('')}
        </ul>
        <p><strong>Tổng cộng:</strong> ${subtotal}đ</p>
      `,
    });

    return NextResponse.json({ message: "Đã gửi mail xác nhận cho khách và thông báo về mail cá nhân!" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}