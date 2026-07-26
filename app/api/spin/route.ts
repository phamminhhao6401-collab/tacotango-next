import { NextRequest, NextResponse } from "next/server";


// Danh sách kết quả theo đúng tỷ lệ:
// 90% giảm %
// 10% freeship
const SPIN_POOL = [
  {
    code: "GIAM2",
    type: "percent",
    value: 2,
    label: "Giảm 2% giá trị đơn",
  },
  {
    code: "GIAM3",
    type: "percent",
    value: 3,
    label: "Giảm 3% giá trị đơn",
  },
  {
    code: "GIAM4",
    type: "percent",
    value: 4,
    label: "Giảm 4% giá trị đơn",
  },
  {
    code: "GIAM5",
    type: "percent",
    value: 5,
    label: "Giảm 5% giá trị đơn",
  },
  {
    code: "GIAM6",
    type: "percent",
    value: 6,
    label: "Giảm 6% giá trị đơn",
  },
  {
    code: "GIAM7",
    type: "percent",
    value: 7,
    label: "Giảm 7% giá trị đơn",
  },
];


const FREESHIP_RESULT = {
  code: "FREESHIP2026",
  type: "freeship",
  value: 0,
  label: "Miễn phí ship",
};


// Random kết quả quay
function pickRandomResult() {

  const roll = Math.random();


  // 10% freeship
  if (roll < 0.1) {
    return FREESHIP_RESULT;
  }


  // 90% chia đều các mã giảm %
  const index = Math.floor(
    Math.random() * SPIN_POOL.length
  );


  return SPIN_POOL[index];
}



export async function POST(req: NextRequest) {

  try {

    const body = await req.json();


    const {
      phone,
      answers
    } = body;



    // Kiểm tra số điện thoại
    if (!phone) {

      return NextResponse.json(
        {
          error: "Thiếu số điện thoại"
        },
        {
          status: 400
        }
      );

    }



    // Kiểm tra Google Apps Script URL
    if (!process.env.GOOGLE_SCRIPT_URL) {

      throw new Error(
        "Thiếu GOOGLE_SCRIPT_URL trong environment variables"
      );

    }



    // Random voucher
    const result = pickRandomResult();



    // Tạo mã voucher duy nhất
    const uniqueCode =
      `${result.code}-${Date.now()
        .toString(36)
        .toUpperCase()}`;



    const spunAt =
      new Date().toISOString();



    // Gửi dữ liệu sang Google Sheet
    const sheetResponse = await fetch(
      process.env.GOOGLE_SCRIPT_URL,
      {

        method: "POST",


        headers: {
          "Content-Type": "application/json",
        },


        body: JSON.stringify({

          phone,


          answers: {

            mood: answers?.mood || "",

            occasion: answers?.occasion || "",

            flavor: answers?.flavor || "",

          },


          code: uniqueCode,


          type: result.type,


          value: result.value,


          used: false,


          spunAt,

        }),

      }
    );



    // Kiểm tra Google Sheet có lưu thành công không
    if (!sheetResponse.ok) {

      throw new Error(
        "Không thể lưu dữ liệu vào Google Sheet"
      );

    }



    // Trả kết quả về frontend
    return NextResponse.json({

      success: true,

      code: uniqueCode,

      label: result.label,

    });



  } catch (err) {


    console.error(
      "Spin error:",
      err
    );


    return NextResponse.json(

      {
        error: "Lỗi hệ thống"
      },

      {
        status: 500
      }

    );

  }

}