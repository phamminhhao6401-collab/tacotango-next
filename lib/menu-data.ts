export type Ingredient = {
  id: string;
  name: string;
  price: number;
};

export type TacoDetail = {
  ingredientsDescription: string;
  sauce: string;
};

export type ComboFlavor = {
  id: string;
  name: string;
};

export type TacoItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  tag?: string;
  image: string;
  details: TacoDetail;
  ingredients?: Ingredient[];

  // Optional fields cho combo / khuyến mãi
  originalPrice?: number;
  isCombo?: boolean;
  comboIncludes?: string;
  comboFlavors?: ComboFlavor[];
};

export const AVAILABLE_INGREDIENTS: Ingredient[] = [
  { id: "sour_cream", name: "Thêm kem chua", price: 5000 },
  { id: "extra_meat", name: "Gấp đôi thịt", price: 15000 },
  { id: "extra_vegetables", name: "Thêm rau", price: 5000 },
];

export const COMBO_FLAVORS: ComboFlavor[] = [
  { id: "milonga", name: "Taco Milonga - Vị Nguyên Bản" },
  { id: "vals", name: "Taco Vals - Thêm Nhiều Kem Chua & Cà Chua" },
  { id: "nuevo", name: "Taco Nuevo - Đẫm Sốt BBQ" },
  { id: "lento", name: "Taco Lento - Extra Bắp Ngọt" },
  { id: "layumba", name: "Taco La Yumba - Cay Punchy Bùng Nổ" },
];

export const MENU: TacoItem[] = [
  {
    id: "special_combo",
    name: "Combo Đặc Biệt",
    description: "1 phần walking taco tự chọn trong 5 vị + 1 lon Coca",
    price: 49000,
    originalPrice: 54000,
    emoji: "📣",
    tag: "Combo khuyến mãi",
    image: "/images/combo.png",
    isCombo: true,
    comboIncludes: "1 phần walking taco tự chọn trong 5 vị + 1 lon Coca",
    comboFlavors: COMBO_FLAVORS,
    details: {
      ingredientsDescription:
        "Combo gồm 1 phần walking taco tự chọn trong 5 vị: Taco Milonga, Taco Vals, Taco Nuevo, Taco Lento hoặc Taco La Yumba; kèm 1 lon Coca.",
      sauce: "Sốt đi kèm tùy theo vị walking taco khách chọn.",
    },
    ingredients: AVAILABLE_INGREDIENTS,
  },
  {
    id: "milonga",
    name: "Taco Milonga",
    description: "Vị Nguyên Bản (Happy)",
    price: 39000,
    emoji: "🥑",
    tag: "Ngọt ngào, giòn rụm",
    image: "/images/milonga.png",
    details: {
      ingredientsDescription:
        "Snack Lays, thịt heo xay, gia vị taco, xà lách, rau mùi, cà chua, ớt chuông",
      sauce: "Mayonnaise và Sour cream (Kem chua).",
    },
    ingredients: AVAILABLE_INGREDIENTS,
  },
  {
    id: "vals",
    name: "Taco Vals",
    description: "Thêm Nhiều Kem Chua & Cà Chua (Sad)",
    price: 39000,
    emoji: "🍋",
    tag: "Chua chua thanh thanh",
    image: "/images/vals.jpg",
    details: {
      ingredientsDescription:
        "Snack Lays, thịt heo xay, gia vị taco, xà lách, rau mùi, cà chua tươi, ớt chuông",
      sauce: "Extra Sour cream, Mayonnaise, tương ớt.",
    },
    ingredients: AVAILABLE_INGREDIENTS,
  },
  {
    id: "nuevo",
    name: "Taco Nuevo",
    description: "Đẫm Sốt BBQ Kéo Mood (Stress)",
    price: 39000,
    emoji: "🔥",
    tag: "Đậm đà vị BBQ",
    image: "/images/nuevo.jpg",
    details: {
      ingredientsDescription:
        "Snack Lays, thịt heo xay, gia vị taco, xà lách, rau mùi, bắp ngô ngọt, cà chua tươi",
      sauce: "Sốt BBQ, Sour cream.",
    },
    ingredients: AVAILABLE_INGREDIENTS,
  },
  {
    id: "lento",
    name: "Taco Lento",
    description: "Extra Bắp Ngọt (Chill)",
    price: 39000,
    emoji: "🌽",
    tag: "Ngọt ngào, béo ngậy",
    image: "/images/lento.jpg",
    details: {
      ingredientsDescription:
        "Snack Lays, thịt heo xay, gia vị taco, xà lách, rau mùi, bắp ngô ngọt, cà chua",
      sauce: "Sour cream béo.",
    },
    ingredients: AVAILABLE_INGREDIENTS,
  },
  {
    id: "layumba",
    name: "Taco La Yumba",
    description: "Cay Punchy Bùng Nổ (Angry)",
    price: 39000,
    emoji: "🌶",
    tag: "Cay xé lưỡi, bùng nổ",
    image: "/images/layumba.jpg",
    details: {
      ingredientsDescription:
        "Snack Lays, thịt heo xay, gia vị taco, xà lách, rau mùi, ớt Jalapeño muối, cà chua",
      sauce: "Tương ớt Sriracha, Sour cream, các loại gia vị cay.",
    },
    ingredients: AVAILABLE_INGREDIENTS,
  },
];

export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}