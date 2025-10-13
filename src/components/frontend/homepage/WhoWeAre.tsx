import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { Typography } from "@/components/common/typography";

export default function WhoWeAre({ data }: { data?: any }) {
  return (
    <Section variant='xxl'>
      <Container>
        <div className="mb-10 text-center">
          <Typography variant="body1">{data?.subtitle}</Typography>
          <Typography variant="h3" weight={'bold'} transform={'capitalize'}>{data?.title}</Typography>
        </div>
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
          {data?.features?.map((feature: any, index: number) => (
            <div key={index} className="group flex items-start gap-4 bg-white hover:bg-primary shadow-lg hover:shadow-xl px-4 py-5 rounded-lg transition-all duration-300 ease-in-out">
              <div className="flex justify-center mb-4">
                <feature.icon strokeWidth={1} className="w-16 h-16 text-primary group-hover:text-white group-hover:rotate-45 transition-transform duration-700 ease-in-out delay-200" />
              </div>
              <div className="space-y-2">
                <Typography weight={'bold'} variant={'subtitle1'} className="group-hover:text-white">{feature.title}</Typography>
                <Typography className="text-gray-600 group-hover:text-white">{feature.desc}</Typography>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}