import AboutUs from '@/components/frontend/homepage/AboutUs'
import BannerCarousel from '@/components/frontend/homepage/BannerCarousel'
import Blog from '@/components/frontend/homepage/Blog'
import FAQ from '@/components/frontend/homepage/FAQ'
import Stats from '@/components/frontend/homepage/Stats'
import Testimonials from '@/components/frontend/homepage/Testimonials'
import TopDestinations from '@/components/frontend/homepage/TopDestinations'
import WhoWeAre from '@/components/frontend/homepage/WhoWeAre'
import { homeData } from '@/data/homeData'

export default async function HomePage() {
  // const homeData = await getHomepageData()
  // const homeFaqs = fetchOnServer('/settings/key/homepage_faq', 300)
  // const homepageTestimonials = fetchOnServer('/settings/key/homepage_testimonials', 300)
  // const featuredCategories = fetchOnServer('/categories?isFeatured=true', 300)

  return (
    <>
      <BannerCarousel banners={homeData?.banners} />
      <AboutUs data={homeData?.about} />
      <Stats data={homeData?.about?.stats} />
      <WhoWeAre data={homeData?.whoWeAre} />
      <TopDestinations data={homeData?.overseasAndTravels} />
      <Blog data={homeData?.blog} />
      <Testimonials data={homeData?.testimonials} />
      <FAQ data={homeData?.faq} />
    </>
  )
}
