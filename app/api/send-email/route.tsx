import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Lấy thêm các trường mới từ body
    const { 
      name, email, phone, district, address, note, 
      items, subtotal, shippingFee, total 
    } = body;

    const data = await resend.emails.send({
      from: "Taco Tango <donhang@tacotango.id.vn>",
      to: [email, "donhang@tacotango.id.vn"],
      subject: "🌮 Xác nhận đơn hàng từ Taco Tango",
      react: (
        <EmailTemplate 
          name={name} 
          email={email}
          phone={phone}
          district={district} // Thêm district
          address={address} 
          note={note} 
          items={items} 
          subtotal={subtotal} 
          shippingFee={shippingFee} // Thêm shippingFee
          total={total} // Thêm total
        />
      ),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    return NextResponse.json({ error: "Gửi email thất bại" }, { status: 500 });
  }
}