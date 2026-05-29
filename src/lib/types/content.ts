/**
 * CMS types for the new public copy surface. The public site reads from
 * these tables and always falls back to hardcoded JSX defaults if a row
 * is missing, so pages render even before any admin edit has happened.
 */

export type PageContentType =
  | 'text'
  | 'longtext'
  | 'markdown'
  | 'image_url'
  | 'href'

export type PageContentRow = {
  id: string
  page: string
  block: string
  field: string
  value: string
  type: PageContentType
  updatedAt: string
  updatedBy: string | null
}

/** Convenience lookup: block.field → value for one page. */
export type PageContentMap = Record<string, string>

export type TimelineItem = {
  id: string
  year: string
  head: string
  body: string
  sortOrder: number
  isVisible: boolean
  updatedAt: string
}

export type WayToPartnerItem = {
  id: string
  number: string
  title: string
  description: string
  sortOrder: number
  isVisible: boolean
  updatedAt: string
}
