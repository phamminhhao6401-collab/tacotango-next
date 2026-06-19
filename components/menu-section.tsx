"use client";

import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { MENU, formatVND } from "@/lib/menu-data";
import { useCart } from "@/components/cart-provider";

export function MenuSection() {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  function handleAdd(id: string) {
    const item = MENU.find((m) => m.id === id);
    if (!item) return;
    addItem(item);
    setJustAdded(id);
    setTimeout(() => setJustAdded((cur) => (cur === id ? null : cur)), 1200);
  }

  return (
    <section id="menu" className="bg-mustard px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-3">
          <span className="font-saigon3 text-xs font-bold uppercase tracking-[0.3em] text-tomato">
            Thực đơn
          </span>
          <h2 className="font-saigon2 text-4xl text-blue sm:text-5xl">
            5 vị, mỗi vị một điệu nhảy
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {MENU.map((taco) => {
            const imageBroken = brokenImages[taco.id];
            return (
              <article
                key={taco.id}
                className="group flex w-full max-w-[360px] flex-col justify-between overflow-hidden rounded-2xl border-3 border-blue bg-cream shadow-retro transition-transform hover:-translate-y-1"
              >
                {/* --- KHU VỰC ẢNH MÓN ĂN --- */}
                <div className="relative aspect-[4/3] w-full border-b-3 border-blue bg-mustard">
                  {!imageBroken ? (
                    <Image
                      src={taco.image}
                      alt={taco.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [taco.id]: true }))
                      }
                    />
                  ) : (
                    // Ảnh chưa có / lỗi đường dẫn -> hiện emoji thay thế, không vỡ layout
                    <span className="grid h-full w-full place-items-center text-6xl">
                      {taco.emoji}
                    </span>
                  )}

                  {taco.tag && (
                    <span className="absolute right-3 top-3 z-10 rounded-full border-2 border-blue bg-tomato px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-cream shadow-retro-sm">
                      {taco.tag}
                    </span>
                  )}

                  {taco.emoji && (
                    <span className="absolute -bottom-5 left-4 z-10 grid h-10 w-10 place-items-center rounded-full border-3 border-blue bg-mustard text-lg shadow-retro-sm">
                      {taco.emoji}
                    </span>
                  )}
                </div>

                {/* --- KHU VỰC THÔNG TIN --- */}
                <div className="flex flex-1 flex-col justify-between p-6 pt-8">
                  <div>
                    <h3 className="font-saigon3 text-2xl text-blue">
                      {taco.name}
                    </h3>
                    <p className="mt-2 font-saigon3 text-sm leading-relaxed text-blue/80">
                      {taco.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t-3 border-blue pt-4">
                    <span className="font-saigon3 text-xl text-tomato">
                      {formatVND(taco.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdd(taco.id)}
                      aria-label={`Thêm ${taco.name} vào giỏ`}
                      className="flex items-center gap-1.5 rounded-full border-3 border-blue bg-blue px-4 py-2 font-saigon3 text-xs font-bold uppercase tracking-wide text-mustard transition-colors hover:bg-tomato active:translate-y-0.5"
                    >
                      {justAdded === taco.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          Đã thêm
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" strokeWidth={3} />
                          Thêm
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}