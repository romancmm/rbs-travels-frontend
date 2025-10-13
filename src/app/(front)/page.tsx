import AboutUs from "@/components/frontend/homepage/AboutUs";
import Stats from "@/components/frontend/homepage/Stats";
import WhoWeAre from "@/components/frontend/homepage/WhoWeAre";
import { homeData } from "@/data/homeData";


export default async function HomePage() {
  // const homeData = await getHomepageData()
  // const homeFaqs = fetchOnServer('/settings/key/homepage_faq', 300)
  // const homepageTestimonials = fetchOnServer('/settings/key/homepage_testimonials', 300)
  // const featuredCategories = fetchOnServer('/categories?isFeatured=true', 300)

  return (
    <>


      <AboutUs data={homeData?.about} />
      <Stats data={homeData?.about?.stats} />
      <WhoWeAre data={homeData?.whoWeAre} />

      {/* <HeroSection data={homeData?.hero} />
      <TestimonialOne data={homeData?.gameChanger} />
      <Agencies data={homeData?.agency} />
      <WhyChoose data={homeData?.whyChoose} />
      <Offers data={homeData?.offers} />
      <Categories data={homeData?.categories} categories={featuredCategories} />
      <AvailablePlatforms data={homeData?.platform} />
      <Testimonials data={homepageTestimonials} />
      <Newsletter data={homeData?.subscribe} /> */}
    </>
  )
}
