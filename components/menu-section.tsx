"use client";

import Image from "next/image";
import { Plus, Check, X } from "lucide-react";
import { useState } from "react";
import { MENU, formatVND, type TacoItem, type Ingredient } from "@/lib/menu-data";
import { useCart } from "@/components/cart-provider";

export function MenuSection() {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  
  // State mới cho Modal chọn ingredient
  const [selectedTaco, setSelectedTaco] = useState<TacoItem | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);

  function handleOpenModal(taco: TacoItem) {
    setSelectedTaco(taco);
    setSelectedIngredients([]);
  }

  function handleConfirmAdd() {
    if (!selectedTaco) return;
    addItem(selectedTaco, selectedIngredients);
    setJustAdded(selectedTaco.id);
    setSelectedTaco(null);
    setTimeout(() => setJustAdded(null), 1200);
  }

  const toggleIngredient = (ing: Ingredient) => {
    setSelectedIngredients((prev) =>
      prev.find((i) => i.id === ing.id)
        ? prev.filter((i) => i.id !== ing.id)
        : [...prev, ing]
    );
  };

  return (
    <section id="menu" className="bg-mustard px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-3">
          <span className="font-saigon3 text-xs font-bold uppercase tracking-[0.3em] text-tomato">Thực đơn</span>
          <div className="flex items-center gap-3">
            <h2 className="font-saigon2 text-4xl tracking-wider text-blue sm:text-5xl">5 vị, mỗi vị một điệu nhảy</h2>
            <Image src="/images/SUBMARK@4x.png" alt="Dance icon" width={60} height={60} className="hidden sm:block object-contain animate-bounce" />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {MENU.map((taco) => {
            const imageBroken = brokenImages[taco.id];
            return (
              <article key={taco.id} className="group flex w-full max-w-[360px] flex-col justify-between overflow-hidden rounded-2xl border-3 border-blue bg-cream shadow-retro transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
                <div className="relative aspect-[4/3] w-full border-b-3 border-blue bg-mustard">
                  {!imageBroken ? (
                    <Image src={taco.image} alt={taco.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" onError={() => setBrokenImages((prev) => ({ ...prev, [taco.id]: true }))} />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-6xl">{taco.emoji}</span>
                  )}
                  {taco.tag && (
                    <span className="absolute right-3 top-3 z-10 rounded-full border-2 border-blue bg-tomato px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-cream shadow-retro-sm">{taco.tag}</span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 pt-8">
                  <div>
                    <h3 className="font-saigon3 text-2xl tracking-wider text-blue">{taco.name}</h3>
                    <p className="mt-2 font-mono text-sm leading-relaxed text-blue/80">{taco.description}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t-3 border-blue pt-4">
                    <span className="font-saigon3 text-xl text-tomato">{formatVND(taco.price)}</span>
                    <button type="button" onClick={() => handleOpenModal(taco)} className="flex items-center gap-1.5 rounded-full border-3 border-blue bg-blue px-4 py-2 font-saigon3 text-xs font-bold uppercase tracking-wide text-mustard transition-all duration-200 hover:bg-tomato active:scale-95">
                      {justAdded === taco.id ? <><Check className="h-3.5 w-3.5" strokeWidth={3} /> Đã thêm</> : <><Plus className="h-3.5 w-3.5" strokeWidth={3} /> Thêm</>}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Modal chọn thành phần */}
      {selectedTaco && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border-4 border-blue bg-cream p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-saigon3 text-xl text-blue">Tùy chọn cho {selectedTaco.name}</h3>
              <button onClick={() => setSelectedTaco(null)}><X className="text-blue" /></button>
            </div>
            <div className="space-y-2 mb-6">
              {selectedTaco.ingredients?.map((ing) => (
                <label key={ing.id} className="flex items-center justify-between p-3 border-2 border-blue rounded-xl cursor-pointer hover:bg-mustard/30">
                  <span className="font-saigon3 text-sm">{ing.name}</span>
                  <input type="checkbox" onChange={() => toggleIngredient(ing)} className="accent-tomato h-4 w-4" />
                </label>
              ))}
            </div>
            <button onClick={handleConfirmAdd} className="w-full py-3 bg-blue text-mustard font-bold rounded-full hover:bg-tomato transition-colors">
              Xác nhận thêm
            </button>
          </div>
        </div>
      )}
    </section>
  );
}