'use client'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'
import { SocialLinkType } from '@/lib/validations/schemas/socialLinks'
import CustomImage from './CustomImage'
import CustomLink from './CustomLink'

const socialImages: Record<string, string> = {
    facebook: '/images/social-icon/facebook.svg',
    twitter: '/images/social-icon/x.svg',
    instagram: '/images/social-icon/instagram.svg',
    linkedin: '/images/social-icon/linkedin.svg',
    youtube: '/images/social-icon/youtube.svg',
    google: '/images/social-icon/google.svg',
    pinterest: '/images/social-icon/pinterest.svg',
    apple: '/images/social-icon/apple.svg',
    snapchat: '/images/social-icon/snapchat.svg'
}

const socialPlatformLabels: Record<string, string> = {
    facebook: 'Facebook',
    twitter: 'Twitter/X',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    google: 'Google',
    pinterest: 'Pinterest',
    apple: 'Apple',
    snapchat: 'Snapchat'
}

export default function SocialLinks() {
    const { data, loading } = useAsync(() => '/settings/system_social_links')
    const socialLinks = data?.data?.value

    // Show loading skeletons
    if (loading) {
        return (
            <div className='flex flex-wrap gap-4 lg:gap-6 w-full'>
                {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className='rounded-xl w-10 h-10' />
                ))}
            </div>
        )
    }

    // Don't render anything if no social links
    if (!socialLinks) return null

    // Filter and sort active social links
    const activeSocialLinks = Object.entries(socialLinks)
        .filter(([_, item]) => {
            const socialItem = item as SocialLinkType
            return socialItem.isActive && socialItem.url
        })
        .sort((a, b) => {
            const itemA = a[1] as SocialLinkType
            const itemB = b[1] as SocialLinkType
            return (itemA.order || 0) - (itemB.order || 0)
        })

    // Don't render container if no active links
    if (activeSocialLinks.length === 0) return null

    return (
        <div className='flex flex-wrap gap-4 lg:gap-6 w-full'>
            {activeSocialLinks.map(([platform, item]) => {
                const socialItem = item as SocialLinkType
                const platformLabel =
                    socialItem.displayText || socialPlatformLabels[platform] || platform

                return (
                    <CustomLink
                        key={platform}
                        href={socialItem.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={`Visit our ${platformLabel} page`}
                        title={platformLabel}
                        className='group flex justify-center items-center bg-primary/10 hover:bg-primary shadow-sm hover:shadow-md rounded-xl w-8 lg:w-10 h-8 lg:h-10 aspect-square hover:scale-105 transition-all duration-300'
                    >
                        <CustomImage
                            src={socialImages[platform as keyof typeof socialImages]}
                            alt={`${platformLabel} icon`}
                            width={20}
                            height={20}
                            className='group-hover:brightness-0 group-hover:invert lg:w-5 lg:h-5 object-contain transition-all duration-300'
                        />
                    </CustomLink>
                )
            })}
        </div>
    )
}