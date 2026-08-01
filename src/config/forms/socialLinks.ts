import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import {
  SOCIAL_PLATFORM_CONFIGS,
  SocialPlatform,
  type SocialLinksType
} from '@/lib/validations/schemas/socialLinks'

export const socialLinksFields: FieldConfig<SocialLinksType>[] = Object.values(SocialPlatform).map(
  (platform) => {
    const config = SOCIAL_PLATFORM_CONFIGS[platform]

    return {
      type: 'group',
      title: config.label,
      colSpan: 1,
      fields: [
        {
          type: 'text',
          name: `${platform}.url`,
          placeholder: config.placeholder
        },
        {
          type: 'switch',
          name: `${platform}.isActive`,
          label: 'Active'
        }
      ]
    }
  }
)
