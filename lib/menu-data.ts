export type Ingredient = { id: string; name: string; price: number };

export type TacoDetail = {
  ingredientsDescription: string;
  sauce: string;
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
};

export const AVAILABLE_INGREDIENTS: Ingredient[] = [
  { id: "spicy", name: "Thêm sốt cay", price: 5000 },
  { id: "sour_cream", name: "Thêm kem chua", price: 5000},
  { id: "bbq_sauce", name: "Thêm sốt BBQ", price: 5000},
  { id: "extra_meat", name: "Gấp đôi thịt", price: 15000 },
];

export const MENU: TacoItem[] = [
  {
    id: "milonga",
    name: "Taco Milonga",
    description: "Vị Nguyên Bản (Happy)",
    price: 39000,
    emoji: "🥑",
    tag: "Ngọt ngào, giòn rụm",
    image: "/images/milonga.png",
    details: {
      ingredientsDescription: "Snack Lays, thịt heo xay, gia vị taco, xà lách, rau mùi, phô mai mozzarella, cà chua, ớt chuông",
      sauce: "Mayonnaise và Sour cream (Kem chua)."
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
      ingredientsDescription: "Snack Lays, thịt heo xay, gia vị taco, xà lách, rau mùi, cà chua tươi, phô mai mozzarella, ớt chuông",
      sauce: "Extra Sour cream, Mayonnaise, tương ớt."
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
      ingredientsDescription: "Snack Lays, thịt heo xay, gia vị taco, xà lách, rau mùi, bắp ngô ngọt, phô mai mozzarella, cà chua tươi",
      sauce: "Sốt BBQ, Sour cream."
    },
    ingredients: AVAILABLE_INGREDIENTS,
  },
  {
    id: "lento",
    name: "Taco Lento",
    description: "Extra Cheese & Bắp Ngọt (Chill)",
    price: 39000,
    emoji: "🧀",
    tag: "Ngập ngụa phô mai",
    image: "/images/lento.jpg",
    details: {
      ingredientsDescription: "Snack Lays, thịt heo xay, gia vị taco, xà lách, rau mùi, phô mai mozzarella, bắp ngô ngọt, cà chua",
      sauce: "Sour cream béo."
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
      ingredientsDescription: "Snack Lays, thịt heo xay, gia vị taco, xà lách, rau mùi, ớt Jalapeño muối, phô mai mozzarella, cà chua",
      sauce: "Tương ớt Sriracha, Sour cream, các loại gia vị cay."
    },
    ingredients: AVAILABLE_INGREDIENTS,
  },
];

export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}