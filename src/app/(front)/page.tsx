import { fetchOnServer, getHomepageData } from '@/action/data'
import AboutUs from '@/components/frontend/homepage/AboutUs'
import BannerCarousel from '@/components/frontend/homepage/BannerCarouselThree'
import Blog from '@/components/frontend/homepage/Blog'
import FAQ from '@/components/frontend/homepage/FAQ'
import SisterConcern from '@/components/frontend/homepage/SisterConcern'
import Stats from '@/components/frontend/homepage/Stats'
import Testimonials from '@/components/frontend/homepage/Testimonials'
import TopDestinations from '@/components/frontend/homepage/TopDestinations'
import WhoWeAre from '@/components/frontend/homepage/WhoWeAre'

export default async function HomePage() {
  const homeData = await getHomepageData()
  const homeFaqs = fetchOnServer({ path: '/settings/home_faq_settings', rev: 300 })

  const homepageTestimonials = fetchOnServer({
    path: '/settings/home_testimonial_settings',
    rev: 300
  })

  // const featuredArticle = fetchOnServer({ path: '/articles/posts?categorySlugs=blogs', rev: 300 })

  return (
    <>
      <BannerCarousel data={homeData?.banners} />
      <AboutUs data={homeData?.about} />
      <Stats data={homeData?.about?.stats} />
      <WhoWeAre data={homeData?.whoWeAre} />
      <TopDestinations data={homeData?.topCountries} />
      <SisterConcern />
      <Testimonials data={homepageTestimonials} />
      <Blog />
      <FAQ data={homeFaqs} />
    </>
  )
}
