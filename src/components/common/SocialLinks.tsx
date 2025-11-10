'use client'
import useAsync from "@/hooks/useAsync";
import { SocialLinkType } from "@/lib/validations/schemas/socialLinks";
import CustomImage from "./CustomImage";
import CustomLink from "./CustomLink";

const socialImages = {
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

export default function SocialLinks() {
    const { data, loading } = useAsync(() => '/settings/system_social_links')
    const socialLinks = data?.data?.value;
    return (
        <div className='flex flex-wrap lg:justify-center gap-8 lg:gap-16 w-full'>
            {socialLinks &&
                Object.entries(socialLinks).map(([platform, item]) => {
                    const socialItem = item as SocialLinkType
                    // Only show active social links with valid URLs
                    if (!socialItem.isActive || !socialItem.url) return null

                    return (
                        <CustomLink
                            key={platform}
                            href={socialItem.url}
                            target='_blank'
                            rel='noreferrer'
                            className="group flex justify-center items-center bg-footer-background/80 hover:bg-primary shadow rounded-xl w-10 h-10 hover:scale-110 transition-all duration-300"
                        >
                            <CustomImage
                                src={socialImages[platform as keyof typeof socialImages]}
                                alt={socialItem.displayText || platform}
                                width={20}
                                height={20}
                                className="group-hover:brightness-0 group-hover:invert object-contain transition-all duration-300"
                            />
                        </CustomLink>
                    )
                })}
        </div>
    )
}