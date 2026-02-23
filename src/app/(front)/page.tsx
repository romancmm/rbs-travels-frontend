import { getHomepageData } from '@/action/data'
import AboutUs from '@/components/frontend/homepage/AboutUs'
import BannerCarousel from '@/components/frontend/homepage/BannerCarousel'
import Blog from '@/components/frontend/homepage/Blog'
import FAQ from '@/components/frontend/homepage/FAQ'
import Services from '@/components/frontend/homepage/Services'
import SisterConcern from '@/components/frontend/homepage/SisterConcern'
import Stats from '@/components/frontend/homepage/Stats'
import Testimonials from '@/components/frontend/homepage/Testimonials'
import TopDestinations from '@/components/frontend/homepage/TopDestinations'
import WhoWeAre from '@/components/frontend/homepage/WhoWeAre'

export default async function HomePage() {
  const homeData = await getHomepageData()
  return (
    <>
      <BannerCarousel data={homeData?.banners} />
      <AboutUs data={homeData?.about} />
      <Stats data={homeData?.about?.stats} />
      <WhoWeAre data={homeData?.whoWeAre} />
      <TopDestinations data={homeData?.topCountries} />
      <Services data={homeData?.services} />
      <Testimonials />
      <SisterConcern />
      <FAQ />
      <Blog />
    </>
  )
}
