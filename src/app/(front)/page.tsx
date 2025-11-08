import { getHomepageData } from '@/action/data'
import AboutUs from '@/components/frontend/homepage/AboutUs'
import BannerCarousel from '@/components/frontend/homepage/BannerCarousel'
import Stats from '@/components/frontend/homepage/Stats'

export default async function HomePage() {
  const homeData = await getHomepageData()
  // const homeBanners = fetchOnServer('/settings/key/homepage_settings', 300)
  // const homeFaqs = fetchOnServer('/settings/key/homepage_faq', 300)
  // const homepageTestimonials = fetchOnServer('/settings/key/homepage_testimonials', 300)
  // const featuredCategories = fetchOnServer('/categories?isFeatured=true', 300)

  return (
    <>
      <BannerCarousel data={homeData?.banners} />
      <AboutUs data={homeData?.about} />
      <Stats data={homeData?.about?.stats} />
      {/* 
      
      <WhoWeAre data={homeData?.whoWeAre} />
      <TopDestinations data={homeData?.overseasAndTravels} />
      <Blog data={homeData?.blog} />
      <Testimonials data={homeData?.testimonials} />
      <FAQ data={homeData?.faq} /> */}
    </>
  )
}
