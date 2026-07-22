import type { Metadata } from "next";
import { JetBrains_Mono, Archivo_Black } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

// Font nền cho toàn site: mono cho phần thân, heading đậm cho các tiêu đề mặc định
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

const heading = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
  display: "swap",
});

// 3 font local riêng biệt dùng cho các điểm nhấn đặc trưng (Hero, tên món...)
// Lưu ý: đặt file .ttf của bạn trong app/fonts/1.ttf, 2.ttf, 3.ttf
const saigon1 = localFont({
  src: "./fonts/1.ttf",
  variable: "--font-saigon1",
  display: "swap",
});
const saigon2 = localFont({
  src: "./fonts/2.ttf",
  variable: "--font-saigon2",
  display: "swap",
});
const saigon3 = localFont({
  src: "./fonts/3.ttf",
  variable: "--font-saigon3",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taco Tango",
  description:
    "Taco Tango",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Chỉ nên có DUY NHẤT một thẻ <html> trong toàn bộ app
    <html lang="vi" suppressHydrationWarning>
      {/* Chỉ nên có DUY NHẤT một thẻ <body> trong toàn bộ app */}
      <body
        className={`${mono.variable} ${heading.variable} ${saigon1.variable} ${saigon2.variable} ${saigon3.variable} bg-mustard text-blue font-mono antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
      <GoogleAnalytics gaId="G-C6XYHQHG56" />
    </html>
  );
}