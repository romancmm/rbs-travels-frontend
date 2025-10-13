import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import CustomLink from '@/components/common/CustomLink'
import { sectionVariants } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { siteConfig } from '@/data/siteConfig'
import { cn } from '@/lib/utils'

export default async function Footer() {
  // const siteSettings = await getSiteConfig()
  // const footerNav = await getFooterNav()

  return (
    <footer className={cn(sectionVariants({ variant: 'xl', bg: 'foreground' }))}>
      <Container>
        <div className='justify-between items-start gap-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 lg:pb-10 w-full text-white'>
          <div className='flex flex-col space-y-8'>
            <Typography variant='h5' weight='semibold'>About RBS Travels</Typography>
            <Typography>{siteConfig?.description}</Typography>

            <div className='flex flex-wrap gap-8 w-full'>
              {siteConfig?.socialLinks?.map((item, index) => (
                <CustomLink
                  key={index}
                  href={item.url}
                  target='_blank'
                  rel='noreferrer'
                  className='hover:opacity-80 transition-opacity'
                >
                  <CustomImage
                    src={item.icon}
                    width={20}
                    height={20}
                    alt={item.name}
                    className='max-sm:size-5 object-contain'
                  />
                </CustomLink>
              ))}
            </div>
          </div>
          {siteConfig?.footerNav?.map((nav: any, index: number) => (
            <div key={index} className='space-y-4'>
              <Typography variant='h5' weight='semibold'>
                {nav.title}
              </Typography>
              <div className='flex flex-col items-start space-y-2.5 text-sm'>
                {nav.children?.map((child: any, idx: number) => (
                  <CustomLink
                    key={idx}
                    href={child.url ?? '#'}
                  >
                    {child.title}
                  </CustomLink>
                ))}
              </div>
            </div>
          ))}
        </div>

      </Container>
      {/* <div className='bg-primary py-6'>
        <Container>
          <div className='flex justify-between items-center'>
            <Typography variant='body2'>{siteConfig?.footer?.copyright}</Typography>
            <GotoTop />
          </div>
        </Container>
      </div> */}
    </footer>
  )
}
