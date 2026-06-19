"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

// Quan trọng: luôn trỏ về "/" + anchor để Link hoạt động đúng ở MỌI route,
// không chỉ khi đang ở trang chủ. Next.js sẽ tự điều hướng về trang chủ
// rồi cuộn tới đúng section.
const NAV_LINKS = [
  { href: "/#story", label: "Câu chuyện" },
  { href: "/#menu", label: "Thực đơn" },
  { href: "/#faq", label: "Hỏi đáp" },
];

export function SiteHeader() {
  const { totalItems, isMounted } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-4 border-blue bg-mustard">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-saigon3 text-xl tracking-tight text-blue sm:text-2xl"
        >
          <Image
            src="/images/logo.png"
            alt="Taco Tango Logo"
            width={40}
            height={40}
            priority
            className="rotate-[-6deg] rounded-full border-3 border-blue bg-tomato shadow-retro-sm object-cover"
          />
          <span>
            TACO<span className="text-tomato">TANGO</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-saigon3 text-sm font-bold uppercase tracking-wide text-blue md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative transition-colors hover:text-tomato"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/checkout"
            aria-label="Xem giỏ hàng"
            className="relative flex items-center gap-2 rounded-full border-3 border-blue bg-tomato px-4 py-2 font-saigon3 text-sm font-bold text-cream shadow-retro-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {isMounted && totalItems > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full border-2 border-blue bg-mustard text-xs font-bold text-blue">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Mở menu điều hướng"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border-3 border-blue text-blue md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t-3 border-blue bg-mustard px-4 py-3 font-mono text-sm font-bold uppercase tracking-wide text-blue md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 hover:bg-blue hover:text-mustard"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
