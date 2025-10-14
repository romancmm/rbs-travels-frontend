import CustomLink from '@/components/common/CustomLink'
import SiteLogo from '@/components/common/SiteLogo'
import { containerVariants } from '@/components/common/container'
import { siteConfig } from '@/data/siteConfig'
import MobileNav from './MobileNav'

export default async function MainHeader() {
  // const mainNav = await getMainNav()

  return (
    <div className={containerVariants()}>
      <div className='flex flex-row justify-between lg:items-center gap-x-2 text-white'>
        {/* Logo */}
        <SiteLogo />

        {/* Main Navigation */}
        {siteConfig.mainNav?.length > 0 && (
          <nav className='hidden xl:flex items-center gap-6 lg:gap-8 ml-10 font-semibold'>
            {siteConfig.mainNav.map((item: any, index: number) => (
              <CustomLink key={index} href={item.href ?? '#'}>
                {item.title}
              </CustomLink>
            ))}
          </nav>
        )}

        {/* Mobile Navigation */}
        <MobileNav items={siteConfig.mainNav} />
      </div>
    </div>
  )
}
