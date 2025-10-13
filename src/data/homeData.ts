import { Plane, Earth, DiamondPercent, Binoculars, CalendarClock, Blocks } from 'lucide-react'

export const homeData = {
  hero: {
    title: 'Discover the World with RBS TRAVELS',
    description:
      'Book affordable flights, exclusive tour packages, and hassle-free visa services. Your trusted partner for seamless travel experiences worldwide.',
    action: [
      { title: 'Book Now', url: '/book-now' },
      { title: 'Explore Packages', url: '/tours' }
    ],
    bgUrl: '/images/bg/travel-hero.jpg'
  },

  about: {
    title: 'We provide the best tour facilities.',
    subtitle: 'About Us',
    description:
      'RBS TRAVELS is a full-service travel agency dedicated to helping you explore the world with comfort and convenience. From affordable air tickets to luxurious holiday packages, we make every trip memorable. With a decade of trust, our goal is to deliver personalized service, transparency, and seamless travel experiences.',
    image: '/images/about.jpg',
    facilities: [
      {
        icon: '/images/facilities/01.svg',
        title: 'Safety First Always',
        desc: 'Your safety is our top priority. We adhere to all travel regulations and provide 24/7 support during your journey.'
      },
      {
        icon: '/images/facilities/02.svg',
        title: 'Trusted Travel Guide',
        desc: 'Our experienced agents offer expert advice and personalized recommendations for your perfect trip.'
      },
      {
        icon: '/images/facilities/03.svg',
        title: 'Expertise And Experience',
        desc: 'We leverage our extensive industry knowledge to provide you with the best travel solutions.'
      },
      {
        icon: '/images/facilities/04.svg',
        title: 'Time and Stress Savings',
        desc: 'We handle all the details, so you can focus on enjoying your travel experience.'
      }
    ],
    stats: [
      { value: '1.6k+', label: 'Happy Travelers' },
      { value: '1.2k+', label: 'Tours Success' },
      { value: '98%', label: 'Positives Review' },
      { value: '25', label: 'Travel Guide' }
    ]
  },
  whoWeAre: {
    title: 'Why RBS travels is best',
    subtitle: 'Who We Are',
    features: [
      {
        icon: Earth,
        title: 'Worldwide Coverage',
        desc: 'Extensive network of global partners ensuring comprehensive travel solutions everywhere.'
      },
      {
        icon: DiamondPercent,
        title: 'Competitive Pricing',
        desc: 'Best rates on flights and packages through exclusive deals and partnerships.'
      },
      {
        icon: Plane,
        title: 'Fast Booking',
        desc: 'User-friendly platform for quick and easy travel bookings.'
      },
      {
        icon: Binoculars,
        title: 'Guided Tours',
        desc: 'Expert-led tours providing in-depth knowledge and unique experiences.'
      },
      {
        icon: CalendarClock,
        title: 'Best Support 24/7',
        desc: 'Dedicated support team available around the clock to assist with all travel needs.'
      },
      {
        icon: Blocks,
        title: 'Ultimate Flexibility',
        desc: 'Tailored travel solutions and personalized itineraries to suit your needs.'
      }
    ]
  }
}
