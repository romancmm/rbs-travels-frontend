import { fetchOnServer, getHomepageData } from '@/action/data'
import AboutUs from '@/components/frontend/homepage/AboutUs'
import BannerCarousel from '@/components/frontend/homepage/BannerCarousel'
import Blog from '@/components/frontend/homepage/Blog'
import FAQ from '@/components/frontend/homepage/FAQ'
import Stats from '@/components/frontend/homepage/Stats'
import Testimonials from '@/components/frontend/homepage/Testimonials'
import TopDestinations from '@/components/frontend/homepage/TopDestinations'
import WhoWeAre from '@/components/frontend/homepage/WhoWeAre'

export default async function HomePage() {
  const homeData = await getHomepageData()
  const homeFaqs = fetchOnServer('/settings/home_faq_settings', 300)
  const homepageTestimonials = fetchOnServer('/settings/home_testimonial_settings', 300)
  const featuredArticle = fetchOnServer('/articles/posts?categorySlugs=blogs', 300)
  // const featuredCategories = fetchOnServer('/categories?isFeatured=true', 300)

  return (
    <>
      <BannerCarousel data={homeData?.banners} />
      <AboutUs data={homeData?.about} />
      <Stats data={homeData?.about?.stats} />
      <WhoWeAre data={homeData?.whoWeAre} />
      <TopDestinations data={homeData?.topCountries} />
      <Testimonials data={homepageTestimonials} />
      <Blog data={featuredArticle} />
      <FAQ data={homeFaqs} />
    </>
  )
}
