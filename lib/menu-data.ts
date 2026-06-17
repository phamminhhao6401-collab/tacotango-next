export type MenuItem = {
 id: string
 name: string
 mood: string
 description: string
 ingredients: string
 price: number
 image: string
}


export const MENU: MenuItem[] = [
 {
   id: 'milonga',
   name: 'Taco Milonga',
   mood: 'Hệ Vui Vẻ',
   description: 'Ngọt ngào, giòn rụm',
   ingredients: 'Gà xé, xốt ngọt, snack phô mai',
   price: 45000,
   image: '/images/milonga.png',
 },
 {
   id: 'vals',
   name: 'Taco Vals',
   mood: 'Hệ Suy / Sad',
   description: 'Chua chua thanh thanh',
   ingredients: 'Cheddar chảy, sour cream, chanh, giấm',
   price: 45000,
   image: '/images/vals.jpg',
 },
 {
   id: 'nuevo',
   name: 'Taco Nuevo',
   mood: 'Hệ Chạy Deadline',
   description: 'Đậm đà vị BBQ',
   ingredients: 'Bò bằm, xốt BBQ, hành nướng',
   price: 49000,
   image: '/images/nuevo.jpg',
 },
 {
   id: 'lento',
   name: 'Taco Lento',
   mood: 'Hệ Chilling',
   description: 'Ngập ngụa phô mai',
   ingredients: 'Bơ béo, khoai tây nghiền, kem béo',
   price: 52000,
   image: '/images/lento.jpg',
 },
 {
   id: 'layumba',
   name: 'Taco La Yumba',
   mood: 'Hệ Quạu',
   description: 'Cay xé lưỡi, bùng nổ',
   ingredients: 'Jalapeno, ớt bột',
   price: 49000,
   image:'/images/layumba.jpg',
 },
]


export const SHIPPING_FEE = 15000


export function formatVND(value: number) {
 return value.toLocaleString('vi-VN') + 'đ'
}
