'use client'
import { FeatureGrid, type Feature } from '@/components/admin/dashboard'
import PageHeader from '@/components/common/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  CircleHelp,
  FileQuestion,
  Globe,
  Image as ImageIcon,
  MessageSquareQuote,
  Users,
  Wrench
} from 'lucide-react'

const homepageSections: Feature[] = [
  {
    id: 'banners',
    title: 'Banner Management',
    description: 'Manage the homepage hero banner slides and their call-to-action buttons',
    icon: ImageIcon,
    href: '/admin/homepage-settings/banners',
    color: 'primary'
  },
  {
    id: 'about',
    title: 'About Us',
    description: 'Edit the About section title, description, facilities and stats',
    icon: FileQuestion,
    href: '/admin/homepage-settings/about',
    color: 'blue'
  },
  {
    id: 'who-we-are',
    title: 'Who We Are',
    description: 'Manage the Who We Are section and its feature list',
    icon: Users,
    href: '/admin/homepage-settings/who-we-are',
    color: 'success'
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Manage the services showcased on the homepage',
    icon: Wrench,
    href: '/admin/homepage-settings/services',
    color: 'warning'
  },
  {
    id: 'top-countries',
    title: 'Top Countries',
    description: 'Manage the featured destination countries and their details',
    icon: Globe,
    href: '/admin/homepage-settings/top-countries',
    color: 'purple'
  },
  {
    id: 'sister-concern',
    title: 'Sister Concern',
    description: 'Manage the sister concern listed on the homepage',
    icon: Building2,
    href: '/admin/homepage-settings/sister-concern',
    color: 'pink'
  },
  {
    id: 'testimonials',
    title: 'Testimonials',
    description: 'Manage customer testimonials and reviews',
    icon: MessageSquareQuote,
    href: '/admin/homepage-settings/testimonials',
    color: 'primary'
  },
  {
    id: 'faqs',
    title: 'FAQs',
    description: 'Manage frequently asked questions shown on the homepage',
    icon: CircleHelp,
    href: '/admin/homepage-settings/faqs',
    color: 'sky'
  }
]

export default function HomepageSettingsPage() {
  return (
    <div className='flex flex-col gap-6'>
      <PageHeader
        title='Homepage Settings'
        subTitle='Manage the sections displayed on the homepage'
      />

      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
          <CardDescription>Select a section below to edit its content</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <FeatureGrid features={homepageSections} columns={4} />
        </CardContent>
      </Card>
    </div>
  )
}
