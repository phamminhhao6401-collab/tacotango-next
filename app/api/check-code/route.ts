import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    const normalizedCode = String(code)
      .trim()
      .toUpperCase();


    // =====================================
    // FIXED PROMO CODES
    // =====================================

    const fixedCodes: Record<string, any> = {
      BANBE: {
        type: "freeship",
        value: 0,
      },

      NGUOITHAN: {
        type: "freeship",
        value: 0,
      },
    };


    if (fixedCodes[normalizedCode]) {

      return NextResponse.json({
        valid: true,
        type: fixedCodes[normalizedCode].type,
        value: fixedCodes[normalizedCode].value,
        used: false,
      });

    }



    // =====================================
    // MINIGAME VOUCHER FROM GOOGLE SHEET
    // =====================================

    const response = await fetch(
      `${process.env.GOOGLE_SCRIPT_URL}?code=${encodeURIComponent(normalizedCode)}`
    );


    const data = await response.json();


    if (!data.valid) {

      return NextResponse.json(
        {
          valid:false,
          error:data.error || "Mã không tồn tại"
        },
        {
          status:404
        }
      );

    }


    return NextResponse.json({

      valid:true,
      type:data.type,
      value:data.value,
      used:data.used

    });


  } catch(error) {

    console.error(error);

    return NextResponse.json(
      {
        valid:false,
        error:"Lỗi server"
      },
      {
        status:500
      }
    );

  }
}