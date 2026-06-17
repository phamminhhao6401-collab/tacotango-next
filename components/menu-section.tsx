'use client'


import Image from 'next/image'
import { Plus } from 'lucide-react'
import { MENU, formatVND, type MenuItem } from '@/lib/menu-data'
import { useCart } from '@/components/cart-context'


function MenuCard({ item }: { item: MenuItem }) {
 const { addItem } = useCart()
 return (
   <article className="flex flex-col overflow-hidden border-2 border-mustard bg-card shadow-[6px_6px_0_#E03C31]">
     <div className="relative aspect-square w-full overflow-hidden border-b-2 border-mustard">
       <Image
         src={item.image || '/placeholder.svg'}
         alt={item.name}
         fill
         className="object-cover"
       />
       <span className="absolute left-3 top-3 -rotate-2 border-2 border-blue bg-mustard px-3 py-1 font-heading text-xs font-700 uppercase text-blue">
         {item.mood}
       </span>
     </div>


     <div className="flex flex-1 flex-col p-5">
       <h3 className="font-heading text-2xl font-700 uppercase text-mustard">
         {item.name}
       </h3>
       <p className="mt-1 font-mono text-sm font-700 text-tomato">
         {item.description}
       </p>
       <p className="mt-2 flex-1 font-mono text-sm leading-relaxed text-cream/80">
         {item.ingredients}
       </p>


       <div className="mt-5 flex items-center justify-between gap-3">
         <span className="font-heading text-2xl font-700 text-mustard">
           {formatVND(item.price)}
         </span>
         <button
           onClick={() => addItem(item)}
           className="inline-flex items-center gap-1.5 rounded-sm border-2 border-blue bg-tomato px-4 py-2 font-heading text-sm font-700 uppercase tracking-wide text-primary-foreground shadow-[3px_3px_0_#0F2557] transition-transform hover:-translate-y-0.5"
         >
           <Plus className="h-4 w-4" />
           Thêm vào giỏ
         </button>
       </div>
     </div>
   </article>
 )
}


export function MenuSection() {
 const top = MENU.slice(0, 3)
 const bottom = MENU.slice(3)


 return (
   <section id="menu" className="bg-blue py-20 film-grain-section">
     <div className="mx-auto max-w-6xl px-4">
       <div className="mb-14 text-center">
         <p className="font-mono text-sm font-700 uppercase tracking-widest text-tomato">
           
         </p>
         <h2 className="skew-retro mt-2 inline-block font-heading text-5xl font-700 uppercase text-mustard drop-shadow-[4px_4px_0_#E03C31] sm:text-6xl">
           Ăn theo tâm trạng
         </h2>
       </div>


       <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
         {top.map((item) => (
           <MenuCard key={item.id} item={item} />
         ))}
       </div>


       <div className="mx-auto mt-8 grid max-w-3xl gap-8 sm:grid-cols-2">
         {bottom.map((item) => (
           <MenuCard key={item.id} item={item} />
         ))}
       </div>
     </div>
   </section>
 )
}