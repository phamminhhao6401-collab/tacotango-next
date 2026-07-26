import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { MoodSpinBanner } from "@/components/mood-spin-banner";
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
        <MoodSpinBanner />
        <StorySection />
        <MenuSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  );
}