import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Oswald, JetBrains_Mono } from 'next/font/google'
import './globals.css'


const oswald = Oswald({
 variable: '--font-heading',
 subsets: ['latin', 'latin-ext', 'vietnamese'],
 weight: ['400', '500', '600', '700'],
})


const jetbrainsMono = JetBrains_Mono({
 variable: '--font-mono',
 subsets: ['latin', 'latin-ext', 'vietnamese'],
 weight: ['400', '500', '700'],
})


export const metadata: Metadata = {
 title: 'TACO TANGO — Walking Tacos',
 description:
   'Taco Tango: Walking tacos cho tâm trạng của bạn. Đang quạu thì ăn kiểu quạu, đang vui thì quẩy kiểu vui!',
 generator: 'v0.app',
}


export const viewport: Viewport = {
 themeColor: '#0F2557',
}


export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode
}>) {
 return (
   <html
     lang="vi"
     className={`${oswald.variable} ${jetbrainsMono.variable}`}
   >
     <body className="bg-background font-mono antialiased">
       {children}
       {process.env.NODE_ENV === 'production' && <Analytics />}
     </body>
   </html>
 )
}
