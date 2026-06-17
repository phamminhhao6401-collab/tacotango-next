import { CartProvider } from '@/components/cart-context'
import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { StorySection } from '@/components/story-section'
import { MenuSection } from '@/components/menu-section'
import { FaqSection } from '@/components/faq-section'
import { SiteFooter } from '@/components/site-footer'
import { CartDrawer } from '@/components/cart-drawer'


export default function Page() {
 return (
   <CartProvider>
     <div className="film-grain min-h-screen bg-blue">
       <SiteHeader />
       <main>
         <HeroSection />
         <StorySection />
         <MenuSection />
         <FaqSection />
       </main>
       <SiteFooter />
       <CartDrawer />
     </div>
   </CartProvider>
 )
}
