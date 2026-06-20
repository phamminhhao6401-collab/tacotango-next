export type TacoItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  tag?: string;
  image: string;
};

export const MENU: TacoItem[] = [
  {
    id: "milonga",
    name: "Taco Milonga",
    description: "Gà xé, xốt ngọt, snack phô mai",
    price: 45000,
    emoji: "🍗",
    tag: "Ngọt ngào, giòn rụm",
    image: "/images/milonga.png",
  },
  {
    id: "vals",
    name: "Taco Vals",
    description: "Cheddar chảy, sour cream, chanh, giấm",
    price: 42000,
    emoji: "🧀",
    tag: "Chua chua thanh thanh",
    image: "/images/vals.jpg",
  },
  {
    id: "nuevo",
    name: "Taco Nuevo",
    description: "Đậm đà vị BBQ",
    price: 49000,
    emoji: "🥩",
    tag: "Đậm đà vị BBQ",
    image: "/images/nuevo.jpg",
  },
  {
    id: "lento",
    name: "Taco Lento",
    description: "Bơ béo, khoai tây nghiền, kem béo",
    price: 38000,
    emoji: "🥑",
    tag: "Ngập ngụa phô mai",
    image: "/images/lento.jpg",
  },
  {
    id: "layumba",
    name: "Taco Layumba",
    description: "Jalapeno, ớt bột",
    price: 52000,
    emoji: "🔥",
    tag: "Cay xé lưỡi, bùng nổ",
    image: "/images/layumba.jpg",
  },
];

export function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}