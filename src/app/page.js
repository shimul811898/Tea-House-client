import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import AboutSection from '../components/AboutSection';
import ClientSection from '../components/ClientSection';
import NewsSection from '../components/NewsSection';

async function getFeaturedProducts() {
  try {
    const apiUrl =
      process.env.SERVER_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000';

    const res = await fetch(`${apiUrl}/api/products?featured=true`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.warn('Could not fetch products during SSR, using fallback:', error.message);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <AboutSection />
      <ClientSection />
      <NewsSection />
    </div>
  );
}
