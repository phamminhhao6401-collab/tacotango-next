import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { StorySection } from "@/components/story-section";
import { MenuSection } from "@/components/menu-section";
import { FaqSection } from "@/components/faq-section";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-mustard">
      <SiteHeader />
      <main>
        <Hero />
        <StorySection />
        <MenuSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}
