export type Ingredient = {
  id: string;
  name: string;
  price: number;
};

export type TacoItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  tag?: string;
  image: string;
  ingredients?: Ingredient[];
};

// Danh sách các thành phần tùy chọn có thể thêm vào
export const AVAILABLE_INGREDIENTS: Ingredient[] = [
  { id: "cheese", name: "Thêm phô mai", price: 10000 },
  { id: "spicy", name: "Thêm sốt cay", price: 5000 },
  { id: "extra_meat", name: "Gấp đôi thịt", price: 15000 },
  { id: "no_onion", name: "Không hành tây", price: 0 },
];

export const MENU: TacoItem[] = [
  {
    id: "milonga",
    name: "Taco Milonga",
    description: "Thịt băm, xốt ngọt, snack phô mai",
    price: 45000,
    emoji: "🥓",
    tag: "Ngọt ngào, giòn rụm",
    image: "/images/milonga.png",
    ingredients: AVAILABLE_INGREDIENTS,
  },
  {
    id: "vals",
    name: "Taco Vals",
    description: "Thịt băm, phô mai, chanh, giấm",
    price: 42000,
    emoji: "🧀",
    tag: "Chua chua thanh thanh",
    image: "/images/vals.jpg",
    ingredients: AVAILABLE_INGREDIENTS,
  },
  {
    id: "nuevo",
    name: "Taco Nuevo",
    description: "Thịt băm, sốt BBQ, hành tây",
    price: 49000,
    emoji: "🥩",
    tag: "Đậm đà vị BBQ",
    image: "/images/nuevo.jpg",
    ingredients: AVAILABLE_INGREDIENTS,
  },
  {
    id: "lento",
    name: "Taco Lento",
    description: "Thịt băm, bơ béo, kem béo",
    price: 38000,
    emoji: "🥑",
    tag: "Ngập ngụa phô mai",
    image: "/images/lento.jpg",
    ingredients: AVAILABLE_INGREDIENTS,
  },
  {
    id: "layumba",
    name: "Taco Layumba",
    description: "Thịt băm, jalapeno, ớt bột",
    price: 52000,
    emoji: "🔥",
    tag: "Cay xé lưỡi, bùng nổ",
    image: "/images/layumba.jpg",
    ingredients: AVAILABLE_INGREDIENTS,
  },
];

export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}