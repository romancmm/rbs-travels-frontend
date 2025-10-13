'use client'

import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Section } from '@/components/common/section'



export default function BannerCarousel({ banners }: { banners: { id: number; title: string; subtitle: string; description: string; button: string; image: string }[] }) {
  return (
    <Section variant={'none'} className="relative w-full">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div
                className={cn(
                  'relative flex justify-center items-center bg-cover bg-no-repeat bg-center h-[80vh] md:h-[calc(100vh-5rem)]',
                )}
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className="absolute inset-0 bg-black/50" />

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="z-10 relative mx-auto px-4 max-w-2xl text-white text-center"
                >
                  <motion.h3
                    className="font-bold text-primary-foreground/90 text-sm md:text-lg uppercase tracking-widest"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {banner.subtitle}
                  </motion.h3>

                  <motion.h1
                    className="mt-2 mb-4 font-bold text-3xl md:text-6xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {banner.title}
                  </motion.h1>

                  <motion.p
                    className="mb-6 text-gray-200 text-base md:text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {banner.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      size="lg"
                      variant="secondary"
                      className="font-medium text-base"
                    >
                      {banner.button}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 md:left-10" />
        <CarouselNext className="right-4 md:right-10" />
      </Carousel>
    </Section >
  )
}
