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
  },

  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'FAQ',
    faqs: [
      {
        id: 1,
        question: 'How do I book a trip with RBS Travels?',
        answer:
          'Booking with RBS Travels is simple! You can browse our packages online, call our customer service team, or visit one of our offices. Our travel experts will help you customize your perfect trip based on your preferences and budget.'
      },
      {
        id: 2,
        question: 'What payment methods do you accept?',
        answer:
          'We accept various payment methods including credit cards (Visa, MasterCard, American Express), debit cards, bank transfers, and digital payment platforms. We also offer flexible payment plans for larger bookings.'
      },
      {
        id: 3,
        question: 'Can I modify or cancel my booking?',
        answer:
          'Yes, you can modify or cancel your booking subject to our terms and conditions. Modification fees may apply depending on the timing and type of changes. We recommend reviewing our cancellation policy or contacting our support team for specific details.'
      },
      {
        id: 4,
        question: 'Do you provide travel insurance?',
        answer:
          'Absolutely! We strongly recommend travel insurance and offer comprehensive coverage options through our trusted partners. Our insurance plans cover trip cancellation, medical emergencies, lost luggage, and more.'
      },
      {
        id: 5,
        question: 'What kind of support do you provide during travel?',
        answer:
          'We provide 24/7 customer support throughout your journey. Our team is available to assist with any issues, changes, or emergencies that may arise. We also provide local contact information and emergency numbers for each destination.'
      },
      {
        id: 6,
        question: 'Are your tour guides certified and experienced?',
        answer:
          'Yes, all our tour guides are certified professionals with extensive local knowledge and experience. They undergo regular training and are passionate about sharing the culture, history, and hidden gems of each destination.'
      },
      {
        id: 7,
        question: 'Do you offer group discounts?',
        answer:
          'Yes, we offer attractive group discounts for bookings of 10 or more people. The discount percentage varies based on group size, destination, and season. Contact our group travel specialists for personalized quotes.'
      },
      {
        id: 8,
        question: 'What safety measures do you have in place?',
        answer:
          'Your safety is our top priority. We work only with licensed operators, conduct regular safety audits, provide comprehensive briefings, and maintain emergency protocols. All our packages include safety equipment and trained guides where applicable.'
      }
    ]
  },

  blog: {
    title: 'Latest Travel Stories & Tips',
    subtitle: 'Our Blog',
    posts: [
      {
        id: 1,
        title: 'Hidden Gems of Southeast Asia: Off the Beaten Path Adventures',
        excerpt:
          'Discover untouched destinations and authentic experiences in Southeast Asia that most travelers never get to see. From secret waterfalls to remote villages.',
        image: '/images/banners/01.jpg',
        date: 'Oct 12, 2025',
        category: 'Adventure',
        author: 'Sarah Johnson',
        readTime: '5 min read'
      },
      {
        id: 2,
        title: 'Budget Travel Hacks: How to See the World for Less',
        excerpt:
          'Learn insider tips and tricks to stretch your travel budget further without compromising on experiences. Smart strategies for savvy travelers.',
        image: '/images/banners/02.webp',
        date: 'Oct 10, 2025',
        category: 'Budget Tips',
        author: 'Mike Chen',
        readTime: '7 min read'
      },
      {
        id: 3,
        title: 'Luxury Travel Trends 2025: What to Expect',
        excerpt:
          'Explore the latest trends in luxury travel, from eco-conscious resorts to personalized experiences that define modern high-end tourism.',
        image: '/images/banners/03.jpeg',
        date: 'Oct 8, 2025',
        category: 'Luxury',
        author: 'Emma Wilson',
        readTime: '6 min read'
      },
      {
        id: 4,
        title: 'Solo Female Travel: Safety Tips and Inspiring Destinations',
        excerpt:
          'Empowering solo female travelers with practical safety advice and recommendations for the most inspiring and safe destinations worldwide.',
        image: '/images/banners/04.jpg',
        date: 'Oct 5, 2025',
        category: 'Solo Travel',
        author: 'Lisa Martinez',
        readTime: '8 min read'
      },
      {
        id: 5,
        title: 'Cultural Immersion: How to Travel Like a Local',
        excerpt:
          'Go beyond tourist attractions and discover authentic cultural experiences. Learn how to connect with locals and truly understand destinations.',
        image: '/images/about.jpg',
        date: 'Oct 3, 2025',
        category: 'Culture',
        author: 'David Kim',
        readTime: '6 min read'
      },
      {
        id: 6,
        title: 'Sustainable Travel: Making a Positive Impact',
        excerpt:
          'Discover how to travel responsibly and make a positive impact on the destinations you visit. Tips for eco-friendly and ethical tourism.',
        image: '/images/banners/01.jpg',
        date: 'Oct 1, 2025',
        category: 'Sustainability',
        author: 'Green Traveler',
        readTime: '5 min read'
      }
    ]
  }
}
