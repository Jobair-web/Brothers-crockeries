import HeroCarousel from "@/components/home/HeroCarousel";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import PopularProducts from "@/components/home/PopularProducts";
import TrustStrip from "@/components/home/TrustStrip";
import CustomerReviews from "@/components/home/CustomerReviews";
import TipsSection from "@/components/home/TipsSection";
import FaqSection from "@/components/home/FaqSection";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <FeaturedCategories />
      <PopularProducts />
      <TrustStrip />
      <TipsSection />
      <CustomerReviews />
      <FaqSection />
    </>
  );
}
