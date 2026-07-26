import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu mã voucher",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedCode = String(code)
      .trim()
      .toUpperCase();


    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;


    if (!scriptUrl) {
      throw new Error("Thiếu GOOGLE_SCRIPT_URL");
    }



    const response = await fetch(scriptUrl, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        action: "use-code",
        code: normalizedCode,
      }),
    });



    const data = await response.json();



    if (!data.success) {

      return NextResponse.json(
        {
          success: false,
          error: data.error || "Không thể cập nhật voucher",
        },
        {
          status: 400,
        }
      );

    }



    return NextResponse.json({
      success: true,
      message: "Voucher đã được đánh dấu sử dụng",
    });



  } catch (error) {

    console.error("Use code error:", error);


    return NextResponse.json(
      {
        success: false,
        error: "Lỗi kết nối server",
      },
      {
        status: 500,
      }
    );

  }
}