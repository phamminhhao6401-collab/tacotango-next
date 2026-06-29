"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image"; // Đảm bảo đã import Image

const FAQS = [
  {
    q: "WALKING TACO là cái gì z?",
    a: "Là taco đi bộ được, topping được nhét thẳng vào túi snack, cầm tay đi tới đâu ăn tới đó luôn.",
  },
  {
    q: "Phí ship tính sao nhỉ?",
    a: "Đồng giá 10.000đ cho mọi đơn trong nội thành. Đơn trên 150k là free luôn nha.",
  },
  {
    q: "Tụi mình giao khi nào?",
    a: "Tụi mình sẽ gom order rồi giao vào T4 và T5 hàng tuần. Tranh thủ đặt nha!!!",
  },
  {
    q: "Có món nào cho HỆ YẾU ĐUỐI không?",
    a: "Có chứ! Taco Milonga và Taco Lento siêu hiền, ngọt béo dễ thương. Còn Taco La Yumba thì… hơi cay nha.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-t-4 border-blue bg-cream px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex flex-col gap-3">
          <span className="font-saigon3 text-xs font-bold uppercase tracking-[0.3em] text-tomato">
            Hỏi đáp
          </span>
          
          {/* PHẦN TIÊU ĐỀ CÓ MASCOT NHẢY */}
          <div className="flex items-center gap-3">
            <h2 className="font-saigon2 text-3xl tracking-wider text-blue sm:text-4xl">
              Thắc mắc thường gặp
            </h2>
            <Image 
              src="/images/faqmascot.png" 
              alt="Mascot" 
              width={100} 
              height={100} 
              className="hidden sm:block object-contain animate-bounce" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border-3 border-blue bg-mustard shadow-retro-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-saigon3 text-base tracking-wider text-blue sm:text-lg"
                >
                  {faq.q}
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-tomato transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={2.5}
                  />
                </button>
                {isOpen && (
                  <p className="border-t-3 border-blue px-5 py-4 font-mono font-normal text-sm leading-relaxed text-blue">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}