import { createParser } from 'nuqs'
import { z } from 'zod'

// A Zod schema isn't a nuqs parser — nuqs needs `serialize`, an optional
// `defaultValue`, etc. This adapts each field of a Zod object's shape into
// a real nuqs parser so useQueryStates can read/write it correctly.
function zodFieldToParser<T>(fieldSchema: z.ZodTypeAny) {
  const parser = createParser<T>({
    parse: (value) => {
      const result = fieldSchema.safeParse(value)
      return result.success ? (result.data as T) : null
    },
    serialize: (value) => String(value)
  })

  // Surface a Zod `.default(...)` as the parser's default value so missing
  // query params resolve to it instead of `null`.
  const defaultResult = fieldSchema.safeParse(undefined)
  const defaultValue = defaultResult.success ? defaultResult.data : undefined

  return defaultValue !== undefined ? parser.withDefault(defaultValue as NonNullable<T>) : parser
}

export function zodShapeToParsers<Shape extends z.ZodRawShape>(shape: Shape) {
  return Object.fromEntries(
    Object.entries(shape).map(([key, fieldSchema]) => [
      key,
      zodFieldToParser(fieldSchema as z.ZodTypeAny)
    ])
  ) as { [Key in keyof Shape]: ReturnType<typeof zodFieldToParser> }
}
