'use client'

import Image from 'next/image'

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-mustard bg-blue py-12">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="font-heading text-mustard uppercase tracking-widest">
          Taco Tango — Walking Tacos Since 2026
        </p>
        <p className="mt-4 font-mono text-sm text-cream/70">
          © 2026 Taco Tango. Quẩy hết mình, ăn hết nấc!
        </p>
      </div>
    </footer>
  )
}