import { Hero } from '@/components/hero/Hero';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { ServicesPreview } from '@/components/sections/ServicesPreview';
import { HorizontalStories } from '@/components/sections/HorizontalStories';
import { Showreel } from '@/components/video/Showreel';
import { BeforeAfterSlider } from '@/components/sections/BeforeAfterSlider';
import { Testimonials } from '@/components/sections/Testimonials';
import {
  fetchFeaturedProjects,
  fetchServices,
  fetchSlideshowPhotos,
  fetchTestimonials,
} from '@/lib/supabase/queries';

export default async function HomePage() {
  const [projects, services, testimonials, slides] = await Promise.all([
    fetchFeaturedProjects(),
    fetchServices(),
    fetchTestimonials(),
    fetchSlideshowPhotos(),
  ]);

  return (
    <>
      <Hero photos={slides} />
      <FeaturedWork projects={projects} />
      <ServicesPreview services={services} />
      <HorizontalStories projects={projects} />
      <Showreel />
      <BeforeAfterSlider />
      <Testimonials testimonials={testimonials} />
    </>
  );
}
