import {
  Calender,
  CalenderOutlined,
  Expertise,
  Flexibility,
  GlobePlane,
  Guide,
  GuidOutlined,
  HandStar,
  Safety,
  Support24,
  ThumbStart,
  ThunderPercent,
  Traveler
} from '@/components/icons/extra-icon'

export const homeData = {
  banners: [
    {
      id: 1,
      title: 'Discover the World with RBS Travels',
      subtitle: 'Your Journey Begins Here',
      description:
        'Explore breathtaking destinations, curated tours, and unforgettable experiences — all designed for the modern traveler.',
      button: 'Book Now',
      image: '/images/banners/01.jpg'
    },
    {
      id: 2,
      title: 'Adventure Awaits',
      subtitle: 'Make Every Mile a Memory',
      description:
        'From exotic beaches to mountain escapes, RBS Travels takes you wherever your heart desires.',
      button: 'Explore Packages',
      image: '/images/banners/02.webp'
    },
    {
      id: 3,
      title: 'Luxury Meets Comfort',
      subtitle: 'Travel Smarter, Travel Better',
      description:
        'Experience seamless travel planning, premium accommodations, and personalized service at every step.',
      button: 'Get Started',
      image: '/images/banners/03.jpeg'
    },
    {
      id: 4,
      title: 'Luxury Meets Comfort',
      subtitle: 'Travel Smarter, Travel Better',
      description:
        'Experience seamless travel planning, premium accommodations, and personalized service at every step.',
      button: 'Get Started',
      image: '/images/banners/04.jpg'
    }
  ],

  about: {
    title: 'We provide the best tour facilities.',
    subtitle: 'About Us',
    description:
      'RBS TRAVELS is a full-service travel agency dedicated to helping you explore the world with comfort and convenience. From affordable air tickets to luxurious holiday packages, we make every trip memorable. With a decade of trust, our goal is to deliver personalized service, transparency, and seamless travel experiences.',
    image: '/images/about.jpg',
    facilities: [
      {
        icon: Safety,
        title: 'Safety First Always',
        desc: 'Your safety is our top priority. We adhere to all travel regulations and provide 24/7 support during your journey.'
      },
      {
        icon: Guide,
        title: 'Trusted Travel Guide',
        desc: 'Our experienced agents offer expert advice and personalized recommendations for your perfect trip.'
      },
      {
        icon: Expertise,
        title: 'Expertise And Experience',
        desc: 'We leverage our extensive industry knowledge to provide you with the best travel solutions.'
      },
      {
        icon: Calender,
        title: 'Time and Stress Savings',
        desc: 'We handle all the details, so you can focus on enjoying your travel experience.'
      }
    ],
    stats: [
      { value: '1.6k+', label: 'Happy Travelers', icon: Traveler },
      { value: '500+', label: 'Tours Success', icon: HandStar },
      { value: '98%', label: 'Positives Review', icon: ThumbStart },
      { value: '25', label: 'Travel Guide', icon: GuidOutlined }
    ]
  },
  whoWeAre: {
    title: 'Why RBS travels is best',
    subtitle: 'Who We Are',
    features: [
      {
        icon: GlobePlane,
        title: 'Worldwide Coverage',
        desc: 'Extensive network of global partners ensuring comprehensive travel solutions everywhere.'
      },
      {
        icon: ThunderPercent,
        title: 'Competitive Pricing',
        desc: 'Best rates on flights and packages through exclusive deals and partnerships.'
      },
      {
        icon: CalenderOutlined,
        title: 'Fast Booking',
        desc: 'User-friendly platform for quick and easy travel bookings.'
      },
      {
        icon: GuidOutlined,
        title: 'Guided Tours',
        desc: 'Expert-led tours providing in-depth knowledge and unique experiences.'
      },
      {
        icon: Support24,
        title: 'Best Support 24/7',
        desc: 'Dedicated support team available around the clock to assist with all travel needs.'
      },
      {
        icon: Flexibility,
        title: 'Ultimate Flexibility',
        desc: 'Tailored travel solutions and personalized itineraries to suit your needs.'
      }
    ]
  }
}
