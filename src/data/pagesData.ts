import { PagesData } from '@/types/page'

export const pagesData: PagesData = {
  'about-us': {
    id: 'about-us',
    title: 'About Us',
    slug: 'about-us',
    metaTitle: 'About Us - RBS TRAVELS',
    metaDescription:
      'Learn more about RBS TRAVELS, your trusted travel partner for memorable tours, air tickets, and visa assistance worldwide.',
    content: {
      sections: [
        {
          type: 'hero',
          title: 'About RBS TRAVELS',
          subtitle: 'Your trusted travel companion',
          description:
            'At RBS TRAVELS, we are passionate about helping people explore the world. From flight bookings to tour packages, we make travel seamless, safe, and unforgettable.'
        },
        {
          type: 'text',
          title: 'Our Mission',
          content:
            'To simplify travel for everyone by offering affordable, reliable, and personalized travel solutions. We believe every journey should be stress-free and full of great memories.'
        },
        {
          type: 'text',
          title: 'Our Story',
          content:
            'Founded in 2018, RBS TRAVELS began with a mission to make travel accessible to all. Over the years, we’ve built strong relationships with airlines, hotels, and global partners to provide top-tier service at competitive prices.'
        },
        {
          type: 'stats',
          title: 'Our Achievements',
          stats: [
            { number: '20,000+', label: 'Happy Travelers' },
            { number: '100+', label: 'Tour Packages' },
            { number: '50+', label: 'Countries Covered' },
            { number: '24/7', label: 'Travel Assistance' }
          ]
        },
        {
          type: 'text',
          title: 'Our Values',
          content:
            '**Integrity**: We build trust through transparency and honesty.\\n\\n**Excellence**: We strive to deliver exceptional travel experiences.\\n\\n**Customer Care**: Our team goes the extra mile to support you at every step.\\n\\n**Innovation**: Constantly improving our services to meet your needs.'
        },
        {
          type: 'text',
          title: 'Why Choose RBS TRAVELS?',
          content:
            '• **Expert Guidance**: Decades of combined travel experience.\\n• **Custom Packages**: Tailored trips to fit every budget.\\n• **Visa Assistance**: End-to-end documentation and application support.\\n• **24/7 Support**: Always available for emergencies or last-minute changes.\\n• **Best Deals**: Competitive pricing with no hidden costs.'
        },
        {
          type: 'text',
          title: 'Looking Ahead',
          content:
            'Our vision is to become a global leader in travel experiences — offering sustainable, cultural, and luxury tours that inspire exploration and connection. Wherever you go, RBS TRAVELS will be with you every step of the way.'
        }
      ]
    },
    seo: {
      keywords: ['RBS TRAVELS', 'travel agency', 'tour packages', 'visa assistance', 'air tickets'],
      ogImage: '/images/about-rbs-travels.jpg'
    },
    lastUpdated: '2025-10-12T00:00:00Z'
  },
  'contact-support': {
    id: 'contact-support',
    title: 'Contact & Support',
    slug: 'contact-support',
    metaTitle: 'Contact & Support - RBS TRAVELS',
    metaDescription:
      'Need help planning your next trip? Contact RBS TRAVELS for travel bookings, visa support, or tour inquiries.',
    content: {
      sections: [
        {
          type: 'hero',
          title: 'We’re Here to Help',
          subtitle: '24/7 Travel Assistance',
          description:
            'Our travel experts are available around the clock to help you with bookings, visas, tours, and travel emergencies.'
        },
        {
          type: 'text',
          title: 'Get in Touch',
          content:
            '**Phone**: +880-1234-567890\\n**Email**: support@rbstravels.com\\n**Office**: 25 Gulshan Avenue, Dhaka, Bangladesh\\n**Hours**: Open 7 days a week, 9:00 AM – 10:00 PM'
        },
        {
          type: 'stats',
          title: 'Support Highlights',
          stats: [
            { number: '30 min', label: 'Avg Response Time' },
            { number: '24/7', label: 'Availability' },
            { number: '4.9/5', label: 'Customer Rating' },
            { number: '10+', label: 'Support Experts' }
          ]
        }
      ]
    },
    seo: {
      keywords: ['contact', 'support', 'travel help', 'RBS TRAVELS contact', 'travel agency Dhaka'],
      ogImage: '/images/contact-support-rbs.jpg'
    },
    lastUpdated: '2025-10-12T00:00:00Z'
  }
}
