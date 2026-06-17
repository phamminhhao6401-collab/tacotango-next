'use client'


import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'


const FAQS = [
 {
   q: 'Walking taco là cái gì vậy?',
   a: 'Là taco "đi bộ" được — topping nhét thẳng vào túi snack, cầm tay quẩy tới đâu ăn tới đó. Tiện, gọn, vui hết nấc!',
 },
 {
   q: 'Phí ship tính sao?',
   a: 'Đồng giá 15.000đ cho mọi đơn trong nội thành. Đặt nhiều hay ít cũng một giá, khỏi lo nha.',
 },
 {
   q: 'Tụi mình giao trong bao lâu?',
   a: 'Thường 25–40 phút tùy khu vực. Tụi mình sẽ gọi xác nhận liền sau khi bạn đặt.',
 },
 {
   q: 'Có món nào không cay cho hệ "yếu đuối" không?',
   a: 'Có chứ! Taco Milonga và Taco Lento siêu hiền, ngọt béo dễ thương. Còn Taco La Yumba thì… tự chịu trách nhiệm nha.',
 },
]


export function FaqSection() {
 const [open, setOpen] = useState<number | null>(0)


 return (
   <section id="faq" className="bg-blue py-20">
     <div className="mx-auto max-w-3xl px-4">
       <div className="mb-12 text-center">
         <h2 className="skew-retro inline-block font-heading text-5xl font-700 uppercase text-mustard drop-shadow-[4px_4px_0_#E03C31] sm:text-6xl">
           Hỏi đáp
         </h2>
       </div>


       <div className="flex flex-col gap-4">
         {FAQS.map((faq, i) => {
           const isOpen = open === i
           return (
             <div
               key={faq.q}
               className="border-2 border-mustard bg-card shadow-[4px_4px_0_#E03C31]"
             >
               <button
                 onClick={() => setOpen(isOpen ? null : i)}
                 className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                 aria-expanded={isOpen}
               >
                 <span className="font-heading text-lg font-700 uppercase text-mustard">
                   {faq.q}
                 </span>
                 {isOpen ? (
                   <Minus className="h-5 w-5 shrink-0 text-tomato" />
                 ) : (
                   <Plus className="h-5 w-5 shrink-0 text-tomato" />
                 )}
               </button>
               {isOpen && (
                 <p className="border-t-2 border-dashed border-mustard/40 px-5 py-4 font-mono text-sm leading-relaxed text-cream/85">
                   {faq.a}
                 </p>
               )}
             </div>
           )
         })}
       </div>
     </div>
   </section>
 )
}