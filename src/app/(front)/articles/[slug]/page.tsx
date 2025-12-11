import ArticleDetails from '@/components/frontend/details/ArticleDetails'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  return <ArticleDetails slug={slug} />
}
