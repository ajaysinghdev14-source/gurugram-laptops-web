import { HeroBanner } from "@/components/home/hero-banner";
import { TrustBar } from "@/components/home/trust-bar";
import { FlashSale } from "@/components/home/flash-sale";
import { ShopByBrand } from "@/components/home/shop-by-brand";
import { BudgetCategories } from "@/components/home/budget-categories";
import { TestimonialsFaq } from "@/components/home/testimonials-faq";


export default function Home() {
  return (
    <div className="-mx-8 -mt-8 -mb-8">
      {/* Section 1: Hero Banner - Full width */}
      <div className="px-4 md:px-8 pt-4 md:pt-6">
        <div className="max-w-7xl mx-auto">
          <HeroBanner />
        </div>
      </div>

      {/* Section 2: Trust Bar - Overlapping the banner */}
      <TrustBar />

      {/* Section 3-6: Contained sections */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section 3: Flash Sale */}
        <FlashSale />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Section 4: Shop by Brand */}
        <ShopByBrand />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Section 5: Budget Categories */}
        <BudgetCategories />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Section 6: Testimonials & FAQ */}
        <TestimonialsFaq />
      </div>

    </div>
  );
}
