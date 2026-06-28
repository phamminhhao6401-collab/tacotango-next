import { ArrowDown, Sparkles } from "lucide-react";
import Image from "next/image";

export function Hero() {
return (
<section className="grain-overlay relative overflow-hidden border-b-4 border-blue bg-mustard px-4 py-24 sm:px-6 sm:py-32 lg:py-48">
{/* Ảnh nền */}
<Image
src="/images/hero.jpg"
alt="Taco Tango thoai!!!"
fill
priority
className="absolute inset-0 z-0 object-cover opacity-90"
/>

{/* Lớp phủ tối để làm nổi bật chữ */}
<div className="absolute inset-0 z-10 bg-black/40" />

{/* Lớp lưới chấm */}
<div
className="absolute inset-0 z-20 bg-dot-grid bg-dot-sm opacity-60"
aria-hidden="true"
/>

{/* Nội dung chính */}
<div className="relative z-30 mx-auto flex max-w-6xl flex-col items-center gap-10 text-center">
<span className="inline-flex items-center gap-2 rounded-full border-3 border-blue bg-tomato px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-cream shadow-retro-sm">
<Sparkles className="h-3.5 w-3.5" />
TACO ĐI BỘ VÀO T4 &amp; T5 HÀNG TUẦN
</span>

<Image
src="/images/brand-text.png"
alt="Taco Tango"
width={700} // Chiều rộng gốc của ảnh bạn đã crop
height={400} // Chiều cao gốc
priority
className="mx-auto h-auto w-full max-w-[400px] sm:max-w-[500px] object-contain"
/>

<div className="flex flex-wrap items-center justify-center gap-4 pt-2">
<a
href="#menu"
className="rounded-full border-3 border-cream bg-cream px-7 py-3 font-saigon3 text-sm font-bold uppercase tracking-wider text-blue shadow-tomato transition-transform hover:-translate-y-1 active:translate-y-0"
>
Xem thực đơn
</a>
<a
href="#story"
className="flex items-center gap-2 rounded-full border-3 border-cream px-7 py-3 font-saigon3 text-sm font-bold uppercase tracking-wider text-cream transition-colors hover:bg-cream hover:text-blue"
>
Câu chuyện
<ArrowDown className="h-4 w-4" strokeWidth={2.5} />
</a>
</div>
</div>
</section>
);
}