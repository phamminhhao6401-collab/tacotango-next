'use client'


import Image from 'next/image'


export function HeroSection() {
 return (
   <section id="top" className="relative overflow-hidden border-b-2 border-mustard">
     {/* Direct-flash food photo */}
     <div className="relative h-[78vh] min-h-130 w-full">
       <Image
         src="/images/hero.jpg"
         alt="Walking taco chụp flash thẳng"
         fill
         priority
         className="object-cover"
       />
       {/* dark wash */}
       <div className="absolute inset-0 bg-blue/70" />


       {/* Big skewed title */}
       <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
         <p className="mb-4 inline-block -rotate-2 border-2 border-mustard bg-tomato px-4 py-1 font-heading text-sm font-700 uppercase tracking-widest text-primary-foreground sm:text-base">
           Walking Tacos · Since 2026
         </p>


         <h1 className="skew-retro font-heading text-7xl font-700 uppercase leading-[0.85] text-mustard text-stroke-blue drop-shadow-[6px_6px_0_#0F2557] sm:text-8xl md:text-[10rem]">
           Taco
           <br />
           Tango
         </h1>


         <p className="mt-6 max-w-xl text-pretty font-mono text-base font-500 text-cream sm:text-lg">
           {'Taco biết "quẩy" theo tâm trạng của bạn. Đang quạu thì ăn kiểu quạu, đang vui thì quẩy kiểu vui!'}
         </p>


         <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
           <a
             href="#menu"
             className="inline-flex items-center justify-center rounded-sm border-2 border-blue bg-tomato px-8 py-3 font-heading text-lg font-700 uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_#0F2557] transition-transform hover:-translate-y-0.5"
           >
             Quẩy ngay
           </a>
           <a
             href="#story"
             className="inline-flex items-center justify-center rounded-sm border-2 border-mustard bg-transparent px-8 py-3 font-heading text-lg font-700 uppercase tracking-wide text-mustard transition-colors hover:bg-mustard hover:text-blue"
           >
             Câu chuyện
           </a>
         </div>
       </div>
     </div>
   </section>
 )
}