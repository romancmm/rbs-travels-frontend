export const siteConfig = {
  name: 'NODE CMS',
  description:
    'Your trusted travel agency for air tickets, holiday packages, and visa assistance worldwide.',
  logo: {
    default: '/logo.svg',
    dark: '/logo.svg'
  },
  hotline: '+88 01335144891',
  phone: '+88 01335144891',
  email: 'rbstravels2025@gmail.com',
  address: 'Room No:1203, 11th Floor, Shah Ali Plaza, Mirpur-10, Dhaka-1216',
  contact: {
    offices: [
      {
        country: 'Head Office',
        address: 'Room No:1203, 11th Floor, Shah Ali Plaza, Mirpur-10, Dhaka-1216',
        phone: '+88 01335144891',
        email: 'rbstravels2025@gmail.com'
      },
      {
        country: 'Barishal Office',
        address: 'Stall:30, 1st Floor, Zila Parishad Market, Nobogram Road, Barishal-8200',
        phone: '',
        email: ''
      }
    ]
  },
  socialLinks: [
    {
      name: 'facebook',
      url: 'https://www.facebook.com/rbstravels',
      icon: '/images/social-icon/facebook.svg'
    },
    {
      name: 'X',
      url: 'https://x.com/rbstravels',
      icon: '/images/social-icon/x.svg'
    },
    // {
    //   name: 'instagram',
    //   url: 'https://instagram.com/rbstravels',
    //   icon: '/images/social-icon/instagram.svg'
    // },
    {
      name: 'linkedin',
      url: 'https://linkedin.com/company/rbstravels',
      icon: '/images/social-icon/linkedin.svg'
    },
    {
      name: 'youtube',
      url: 'https://youtube.com/@rbstravels',
      icon: '/images/social-icon/youtube.svg'
    }
    // {
    //   name: 'google',
    //   url: 'https://maps.google.com/?q=RBS+TRAVELS',
    //   icon: '/images/social-icon/google.svg'
    // }
  ],
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'About Us', href: '/page/about' },
    { title: 'Jobs', href: '/page/jobs' },
    {
      title: 'Services',
      href: '/page/services',
      children: [
        { title: 'Flights', href: '/page/flights' },
        { title: 'Tours & Packages', href: '/page/tours' },
        { title: 'Visa Services', href: '/page/visa-services' },
        { title: 'Hotels', href: '/page/hotels' }
      ]
    },
    // { title: 'Flights', href: '/flights' },
    // { title: 'Tours & Packages', href: '/tours' },
    // { title: 'Visa Services', href: '/visa-services' },
    // { title: 'Hotels', href: '/hotels' },
    { title: 'Gallery', href: '/page/gallery' },
    { title: 'Contact Us', href: '/page/contact' }
  ],
  footerNav: [
    {
      title: 'Company',
      children: [
        { title: 'About Us', href: '/page/about' },
        { title: 'FAQ', href: '/page/faq' },
        { title: 'Testimonials', href: '/page/testimonials' },
        { title: 'Terms & Conditions', href: '/page/terms' },
        { title: 'Privacy Policy', href: '/page/privacy-policy' }
      ]
    },
    {
      title: 'Services',
      children: [
        { title: 'Air Ticket Booking', href: '/page/flights' },
        { title: 'Holiday Packages', href: '/page/tours' },
        { title: 'Visa Assistance', href: '/page/visa-services' },
        { title: 'Hotel Reservations', href: '/page/hotels' },
        { title: 'Travel Insurance', href: '/page/travel-insurance' }
      ]
    }
  ],
  footer: {
    copyright: '© NODE CMS | All rights reserved.'
  }
}
