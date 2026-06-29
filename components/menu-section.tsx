"use client";

import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { MENU, formatVND, type TacoItem, type Ingredient } from "@/lib/menu-data";
import { useCart } from "@/components/cart-provider";

export function MenuSection() {
  const { addItem } = useCart();
  const [selectedTaco, setSelectedTaco] = useState<TacoItem | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);

  function handleConfirmAdd() {
    if (!selectedTaco) return;
    addItem(selectedTaco, selectedIngredients);
    setSelectedTaco(null);
    setSelectedIngredients([]);
  }

  return (
    <section id="menu" className="bg-mustard px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* TIÊU ĐỀ */}
        <div className="mb-12 flex flex-col gap-3">
          <span className="font-saigon3 text-xs font-bold uppercase tracking-[0.3em] text-tomato">Thực đơn</span>
          <div className="flex items-center gap-3">
            <h2 className="font-saigon2 text-4xl tracking-wider text-blue sm:text-5xl">
              5 vị, mỗi vị một điệu nhảy
            </h2>
            <Image src="/images/mascot.png" alt="Mascot" width={100} height={100} className="hidden sm:block object-contain animate-bounce" />
          </div>
        </div>

        {/* LIST TACO */}
        <div className="flex flex-wrap justify-center gap-6">
          {MENU.map((taco) => (
            <article key={taco.id} className="group flex w-full max-w-[360px] flex-col justify-between overflow-hidden rounded-2xl border-3 border-blue bg-cream shadow-retro transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="relative aspect-[4/3] w-full border-b-3 border-blue bg-mustard overflow-hidden">
                <Image src={taco.image} alt={taco.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                {taco.tag && (
                  <span className="absolute right-3 top-3 z-10 rounded-full border-2 border-blue bg-tomato px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-cream shadow-retro-sm">
                    {taco.tag}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6 pt-8">
                <h3 className="font-saigon3 text-2xl tracking-wider text-blue">{taco.name}</h3>
                <p className="text-blue/70 text-sm italic mb-4">{taco.description}</p>
                <div className="space-y-4">
                  <p className="font-mono text-sm text-blue/90 leading-relaxed">
                    {taco.details.ingredientsDescription}
                  </p>
                  <div className="p-3 bg-tomato/10 border-l-4 border-tomato rounded-r-lg">
                    <p className="font-mono text-sm text-tomato font-bold leading-relaxed italic">
                      {taco.details.sauce}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t-3 border-blue p-6 pt-4">
                <span className="font-saigon3 text-xl text-tomato">{formatVND(taco.price)}</span>
                <button 
                  onClick={() => { setSelectedTaco(taco); setSelectedIngredients([]); }}
                  className="flex items-center gap-1.5 rounded-full border-3 border-blue bg-blue px-4 py-2 font-saigon3 text-xs font-bold uppercase tracking-wide text-mustard transition-all duration-200 hover:bg-tomato active:scale-95"
                >
                  <Plus size={16} strokeWidth={3} /> Thêm
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      
      {/* MODAL */}
      {selectedTaco && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border-4 border-blue bg-cream p-6 shadow-2xl">
            {/* NÚT ĐÓNG */}
            <button 
              onClick={() => setSelectedTaco(null)} 
              className="absolute right-4 top-4 text-blue hover:text-tomato transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="mb-4 font-saigon3 text-xl text-blue">Tùy chọn: {selectedTaco.name}</h3>
            
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {selectedTaco.ingredients?.map((ing) => (
                <label key={ing.id} className="flex items-center justify-between p-3 border-2 border-blue rounded-xl mb-2 cursor-pointer hover:bg-mustard/20">
                  <span className="font-saigon3 text-sm">{ing.name} ({formatVND(ing.price)})</span>
                  <input 
                    type="checkbox" 
                    checked={selectedIngredients.some(i => i.id === ing.id)}
                    onChange={(e) => e.target.checked 
                      ? setSelectedIngredients([...selectedIngredients, ing]) 
                      : setSelectedIngredients(selectedIngredients.filter(i => i.id !== ing.id))
                    } 
                    className="accent-tomato h-4 w-4" 
                  />
                </label>
              ))}
            </div>

            <button 
              onClick={handleConfirmAdd} 
              className="w-full mt-6 py-3 bg-blue text-mustard font-bold rounded-full hover:bg-tomato transition-colors"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </section>
  );
}