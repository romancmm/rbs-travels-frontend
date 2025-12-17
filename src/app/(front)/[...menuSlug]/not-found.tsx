import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function NotFoundPage() {
    return (
        <>
            <Section className='bg-linear-to-r from-primary/90 to-primary/70'>
                <Container>
                    <div className='py-12 text-white text-center'>
                        <Typography variant='h1' weight='bold' className='mb-4'>
                            Page Not Found
                        </Typography>
                        <Typography variant='body1' className='opacity-90'>
                            The page you&apos;re looking for doesn&apos;t exist
                        </Typography>
                    </div>
                </Container>
            </Section>

            <Section variant={'xl'}>
                <Container>
                    <div className='flex flex-col justify-center items-center py-16 text-center'>
                        <FileQuestion className='mb-4 w-16 h-16 text-muted-foreground' />
                        <Typography variant='h4' weight='semibold' className='mb-2 text-gray-800'>
                            404 - Page Not Found
                        </Typography>
                        <Typography variant='body1' className='mb-6 text-gray-600'>
                            The page you are looking for might have been removed, had its name changed, or is
                            temporarily unavailable.
                        </Typography>
                        <Link href='/'>
                            <Button>Back to Home</Button>
                        </Link>
                    </div>
                </Container>
            </Section>
        </>
    )
}
