"use client";

import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  MENU,
  formatVND,
  type TacoItem,
  type Ingredient,
} from "@/lib/menu-data";
import { useCart } from "@/components/cart-provider";

export function MenuSection() {
  const { addItem } = useCart();

  const [selectedTaco, setSelectedTaco] = useState<TacoItem | null>(null);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );
  const [selectedComboFlavorId, setSelectedComboFlavorId] = useState("");

  const comboItem = MENU.find((taco) => taco.isCombo);
  const regularTacos = MENU.filter((taco) => !taco.isCombo);

  function handleOpenOptions(taco: TacoItem) {
    setSelectedTaco(taco);
    setSelectedIngredients([]);
    setSelectedComboFlavorId("");
  }

  function handleCloseModal() {
    setSelectedTaco(null);
    setSelectedIngredients([]);
    setSelectedComboFlavorId("");
  }

  function handleConfirmAdd() {
    if (!selectedTaco) return;

    let finalIngredients = [...selectedIngredients];

    if (selectedTaco.isCombo) {
      const selectedFlavor = selectedTaco.comboFlavors?.find(
        (flavor) => flavor.id === selectedComboFlavorId
      );

      if (!selectedFlavor) {
        alert("Vui lòng chọn vị walking taco cho combo.");
        return;
      }

      const comboFlavorOption: Ingredient = {
        id: `combo_flavor_${selectedFlavor.id}`,
        name: `Vị walking taco: ${selectedFlavor.name}`,
        price: 0,
      };

      finalIngredients = [comboFlavorOption, ...finalIngredients];
    }

    addItem(selectedTaco, finalIngredients);

    setSelectedTaco(null);
    setSelectedIngredients([]);
    setSelectedComboFlavorId("");
  }

  function renderIngredientPrice(price: number) {
    return price === 0 ? "Miễn phí" : formatVND(price);
  }

  return (
    <section id="menu" className="bg-mustard px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* TIÊU ĐỀ */}
        <div className="mb-12 flex flex-col gap-3">
          <span className="font-saigon3 text-xs font-bold uppercase tracking-[0.3em] text-tomato">
            Thực đơn
          </span>

          <div className="flex items-center gap-3">
            <h2 className="font-saigon2 text-4xl tracking-wider text-blue sm:text-5xl">
              5 vị, mỗi vị một điệu nhảy
            </h2>

            <Image
              src="/images/mascot.png"
              alt="Mascot"
              width={100}
              height={100}
              className="hidden object-contain animate-bounce sm:block"
            />
          </div>
        </div>

        {/* COMBO KHUYẾN MÃI */}
        {comboItem && (
          <div className="mb-12">
            <article className="group grid overflow-hidden rounded-3xl border-3 border-blue bg-cream shadow-retro transition-all duration-300 hover:-translate-y-1 hover:shadow-lg lg:grid-cols-[1.1fr_1.4fr]">
              <div className="relative min-h-[260px] overflow-hidden border-b-3 border-blue bg-mustard lg:border-b-0 lg:border-r-3">
                <Image
                  src={comboItem.image}
                  alt={comboItem.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 z-10 rounded-full border-2 border-blue bg-tomato px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide text-cream shadow-retro-sm">
                  📣 Combo khuyến mãi
                </span>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-4xl">{comboItem.emoji}</span>

                    <h3 className="font-saigon2 text-3xl tracking-wider text-blue sm:text-4xl">
                      {comboItem.name}
                    </h3>
                  </div>

                  <p className="mb-5 font-saigon3 text-lg text-tomato sm:text-xl">
                    {comboItem.description}
                  </p>

                  <div className="mb-5 rounded-2xl border-2 border-blue bg-mustard p-4">
                    <p className="font-mono text-sm font-bold leading-relaxed text-blue">
                      Chọn vị taco ở bước tiếp theo. Coca đã bao gồm sẵn trong
                      combo.
                    </p>
                  </div>

                  <div className="mb-6 rounded-r-lg border-l-4 border-tomato bg-tomato/10 p-3">
                    <p className="font-mono text-sm font-bold italic leading-relaxed text-tomato">
                      {comboItem.details.sauce}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t-3 border-blue pt-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    {typeof comboItem.originalPrice === "number" && (
                      <p className="mb-1 font-mono text-sm font-bold text-blue/60 line-through">
                        Giá mua lẻ: {formatVND(comboItem.originalPrice)}
                      </p>
                    )}

                    <p className="font-saigon3 text-4xl text-tomato">
                      {formatVND(comboItem.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenOptions(comboItem)}
                    className="flex items-center justify-center gap-1.5 rounded-full border-3 border-blue bg-blue px-6 py-3 font-saigon3 text-xs font-bold uppercase tracking-wide text-mustard transition-all duration-200 hover:bg-tomato active:scale-95"
                  >
                    <Plus size={16} strokeWidth={3} /> Thêm combo
                  </button>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* LIST TACO CŨ */}
        <div className="flex flex-wrap justify-center gap-6">
          {regularTacos.map((taco) => (
            <article
              key={taco.id}
              className="group flex w-full max-w-[360px] flex-col justify-between overflow-hidden rounded-2xl border-3 border-blue bg-cream shadow-retro transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b-3 border-blue bg-mustard">
                <Image
                  src={taco.image}
                  alt={taco.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {taco.tag && (
                  <span className="absolute right-3 top-3 z-10 rounded-full border-2 border-blue bg-tomato px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-cream shadow-retro-sm">
                    {taco.tag}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6 pt-8">
                <h3 className="font-saigon3 text-2xl tracking-wider text-blue">
                  {taco.name}
                </h3>

                <p className="mb-4 text-sm italic text-blue/70">
                  {taco.description}
                </p>

                <div className="space-y-4">
                  <p className="font-mono text-sm leading-relaxed text-blue/90">
                    {taco.details.ingredientsDescription}
                  </p>

                  <div className="rounded-r-lg border-l-4 border-tomato bg-tomato/10 p-3">
                    <p className="font-mono text-sm font-bold italic leading-relaxed text-tomato">
                      {taco.details.sauce}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t-3 border-blue p-6 pt-4">
                <span className="font-saigon3 text-xl text-tomato">
                  {formatVND(taco.price)}
                </span>

                <button
                  onClick={() => handleOpenOptions(taco)}
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
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-blue transition-colors hover:text-tomato"
            >
              <X size={24} />
            </button>

            <h3 className="mb-4 pr-8 font-saigon3 text-xl text-blue">
              Tùy chọn: {selectedTaco.name}
            </h3>

            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {selectedTaco.isCombo && (
                <div className="mb-4 rounded-xl border-2 border-blue bg-mustard/30 p-3">
                  <label className="mb-2 block font-saigon3 text-sm text-blue">
                    Chọn vị walking taco cho combo
                  </label>

                  <select
                    required
                    value={selectedComboFlavorId}
                    onChange={(e) => setSelectedComboFlavorId(e.target.value)}
                    className="w-full rounded-lg border-2 border-blue bg-cream p-3 font-mono text-sm text-blue"
                  >
                    <option value="">Chọn 1 trong 5 vị</option>

                    {selectedTaco.comboFlavors?.map((flavor) => (
                      <option key={flavor.id} value={flavor.id}>
                        {flavor.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedTaco.ingredients?.map((ing) => (
                <label
                  key={ing.id}
                  className="mb-2 flex cursor-pointer items-center justify-between rounded-xl border-2 border-blue p-3 hover:bg-mustard/20"
                >
                  <span className="font-saigon3 text-sm">
                    {ing.name} ({renderIngredientPrice(ing.price)})
                  </span>

                  <input
                    type="checkbox"
                    checked={selectedIngredients.some((i) => i.id === ing.id)}
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedIngredients([...selectedIngredients, ing])
                        : setSelectedIngredients(
                            selectedIngredients.filter((i) => i.id !== ing.id)
                          )
                    }
                    className="h-4 w-4 accent-tomato"
                  />
                </label>
              ))}
            </div>

            <button
              onClick={handleConfirmAdd}
              className="mt-6 w-full rounded-full bg-blue py-3 font-bold text-mustard transition-colors hover:bg-tomato"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}
    </section>
  );
}