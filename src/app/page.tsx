import Header from "../components/Header";
import Hero from "../components/Hero";
import DealsSection from "../components/DealsSection";
import TrendingGrid from "../components/TrendingGrid";
import PromoShowcase from "../components/PromoShowcase";
import VendorBanner from "../components/VendorBanner";
import ProductsShowcase from "../components/ProductsShowcase";
import ProductsCarousel from "../components/ProductsCarousel";
import OfferNewsletterBanner from "../components/OfferNewsletterBanner";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <DealsSection />
      <TrendingGrid />
      <PromoShowcase />
      <VendorBanner />
      <ProductsShowcase />
      <ProductsCarousel />
      <OfferNewsletterBanner />
      <Footer />
    </>
  );
}
