import PackageDetailRenderer from '@/components/frontend/details/content-renderers/PackageDetailRenderer'
import PageBuilderRenderer from '@/components/frontend/page-builder/Renderer'
import type { ContentTypeConfig } from '@/config/contentTypes'
import ArticleDetailRenderer from './ArticleDetailRenderer'
import GalleryDetailRenderer from './GalleryDetailRenderer'
import ProductDetailRenderer from './ProductDetailRenderer'
import ServiceDetailRenderer from './ServiceDetailRenderer'

interface ContentRendererProps {
  data: any
  config: ContentTypeConfig
}

/**
 * Smart content renderer that selects the appropriate renderer based on content type
 */
export default function ContentRenderer({ data, config }: ContentRendererProps) {
  switch (config.detailRenderer) {
    case 'page-builder':
      return data.content ? <PageBuilderRenderer content={data.content} /> : null

    case 'blog':
      return <ArticleDetailRenderer data={data} />

    case 'service':
      return <ServiceDetailRenderer data={data} />

    case 'product':
      return <ProductDetailRenderer data={data} />

    case 'package':
      return <PackageDetailRenderer data={data} />

    case 'gallery':
      return <GalleryDetailRenderer data={data} />

    default:
      return (
        <div className='p-8 text-gray-600 text-center'>
          Renderer not implemented for: {config.detailRenderer}
        </div>
      )
  }
}
