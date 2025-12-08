import { HeroSection } from "@/components/sections/HeroSection";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { BrandStory } from "@/components/sections/BrandStory";
import { ExclusiveMembership } from "@/components/sections/MembershipCTA";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <HeroSection />
      <ProductShowcase />
      <BrandStory />
      <ExclusiveMembership />
    </main>
  );
}
