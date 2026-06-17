'use client'

import Image from 'next/image'
import { ShoppingCart, User, Menu as MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/components/cart-context'

const NAV = [
  { label: 'Câu chuyện', href: '#story' },
  { label: 'Thực đơn', href: '#menu' },
  { label: 'Hỏi đáp', href: '#faq' },
]

export function SiteHeader() {
  const { count, openCart } = useCart() // Giờ đã gọi đúng hàm openCart
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b-2 border-mustard bg-blue/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-3 shrink-0">
          <Image
            src="/images/logo.png"
            alt="Taco Tango logo"
            width={56}
            height={56}
            className="h-12 w-12 rounded-full border-2 border-mustard object-cover sm:h-14 sm:w-14"
            priority
          />
          <span className="font-heading text-xl font-700 uppercase tracking-wide text-mustard sm:text-2xl">
            Taco Tango
          </span>
        </a>

        {/* Center nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-heading text-lg font-600 uppercase tracking-wide text-mustard transition-colors hover:text-tomato"
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={openCart}
            aria-label="Mở giỏ hàng"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-tomato text-primary-foreground transition-transform hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-blue bg-mustard px-1 text-xs font-700 text-blue">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center text-mustard md:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}