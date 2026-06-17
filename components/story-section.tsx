'use client'


import Image from 'next/image'


function Polaroid({
 src,
 alt,
 caption,
 rotate,
}: {
 src: string
 alt: string
 caption: string
 rotate: string
}) {
 return (
   <div className={`mx-auto w-full max-w-sm ${rotate}`}>
     <div className="bg-cream p-3 shadow-[8px_8px_0_#0F2557]">
       <div className="film-frame">
         <div className="relative aspect-square w-full overflow-hidden">
           <Image src={src} alt={alt} fill className="object-cover" />
         </div>
       </div>
       <p className="pt-3 text-center font-mono text-sm font-500 text-blue">
         {caption}
       </p>
     </div>
   </div>
 )
}


export function StorySection() {
 return (
   <section id="story" className="bg-blue py-20">
     <div className="mx-auto max-w-6xl px-4">
       <div className="mb-14 text-center">
         <h2 className="skew-retro inline-block font-heading text-5xl font-700 uppercase text-mustard drop-shadow-[4px_4px_0_#E03C31] sm:text-6xl">
           Chuyện của tụi mình
         </h2>
       </div>


       {/* Part 1: text left, image right */}
       <div className="grid items-center gap-10 md:grid-cols-2">
         <div className="border-l-4 border-tomato pl-6">
           <span className="font-heading text-7xl font-700 text-tomato/40">
             01
           </span>
           <p className="text-pretty font-mono text-lg leading-relaxed text-cream">
             {'Chỉ cần nghe đến từ "Tango", tâm trí bạn sẽ lập tức hòa vào những nhịp điệu cuốn hút, sự chuyển động mượt mà và những biến tấu không ngừng.'}
           </p>
         </div>
         <Polaroid
           src="/images/tango.jpg"
           alt="Cặp đôi nhảy tango phong cách retro"
           caption="// vũ điệu Tango bất tận"
           rotate="rotate-2"
         />
       </div>


       {/* Part 2: image left, text right */}
       <div className="mt-20 grid items-center gap-10 md:grid-cols-2">
         <Polaroid
           src="/images/emotions.png"
           alt="Ảnh Gen Z retro nhiều cảm xúc"
           caption="// mood lên bổng xuống trầm"
           rotate="-rotate-2 md:order-1"
         />
         <div className="border-l-4 border-mustard pl-6 md:order-2">
           <span className="font-heading text-7xl font-700 text-mustard/40">
             02
           </span>
           <p className="text-pretty font-mono text-lg leading-relaxed text-cream">
             {'Y hệt như những cung bậc cảm xúc, tâm trạng của tụi mình cũng "lên bổng xuống trầm", lúc dồn dập lúc thong thả mỗi ngày. Thế nên phương châm của tụi này là: '}
             <span className="font-700 text-tomato">
               {'Đang quạu thì ăn kiểu quạu, đang vui thì quẩy kiểu vui!'}
             </span>
           </p>
         </div>
       </div>
     </div>
   </section>
 )
}