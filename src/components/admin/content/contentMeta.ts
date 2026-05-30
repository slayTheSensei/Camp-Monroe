/**
 * Human-friendly labels and hints for the page_content fields.
 *
 * Keyed by "<block>.<field>". Anything not in this map falls back to
 * a humanized version of the underscore-separated key.
 *
 * Adding new editable fields:
 *   1. Insert a new row in page_content
 *   2. Add an entry here so it has a proper label + hint
 */

export type FieldMeta = {
  label: string
  hint?: string
}

export type BlockMeta = {
  label: string
  description?: string
  fields: Record<string, FieldMeta>
}

type PageMeta = {
  label: string
  publicPath: string | null
  description: string
  /** Order blocks appear in. Blocks not listed render at the end. */
  blockOrder?: string[]
  blocks: Record<string, BlockMeta>
}

const META: Record<string, PageMeta> = {
  site: {
    label: 'Site-wide',
    publicPath: '/',
    description:
      'The amber call-to-action band and the footer appear on every public page. Edits here affect every page at once.',
    blockOrder: ['cta_band', 'footer'],
    blocks: {
      cta_band: {
        label: 'Call-to-action band',
        description:
          'The amber band that sits above the footer on every page.',
        fields: {
          eyebrow: {
            label: 'Eyebrow',
            hint: 'Small label above the headline, e.g. "Membership · By sponsorship".',
          },
          headline: {
            label: 'Headline',
            hint: 'The big Fraunces serif headline.',
          },
          body: {
            label: 'Body copy',
            hint: 'One sentence under the headline.',
          },
          primary_label: {
            label: 'Primary button label',
            hint: 'Filled amber button. Links to /request.',
          },
          secondary_label: {
            label: 'Secondary button label',
            hint: 'Outlined button. Links to /the-camp.',
          },
        },
      },
      footer: {
        label: 'Footer',
        description: 'Brand block, contact info, and the small print.',
        fields: {
          brand_l1: {
            label: 'Brand — line 1',
            hint: 'Top line of the footer brand block. Usually the club name.',
          },
          brand_l2: {
            label: 'Brand — line 2',
            hint: 'Small amber subtitle under the brand.',
          },
          brand_p: {
            label: 'Brand description',
            hint: 'One short paragraph under the brand block.',
          },
          contact_email: {
            label: 'Contact email',
            hint: 'Click-to-mailto address in the Contact column.',
          },
          address_l1: { label: 'Address — line 1' },
          address_l2: { label: 'Address — line 2' },
          meta_left: {
            label: 'Small-print line',
            hint: 'The 501(c)(7) / management company line at the very bottom of the footer.',
          },
        },
      },
    },
  },

  home: {
    label: 'Home',
    publicPath: '/',
    description: 'Editable copy on the home page — hero, story split, pull quote.',
    blockOrder: ['hero', 'story_split', 'pull_quote'],
    blocks: {
      hero: {
        label: 'Hero',
        description: 'The full-bleed lake photo and overlaid text at the top of the home page.',
        fields: {
          tier_label: {
            label: 'Caption — photo tier',
            hint: 'Small caption shown on the photo, e.g. "Photograph · Lake Cobbosseecontee at sunset".',
          },
          location_label: {
            label: 'Caption — location',
            hint: 'Small caption shown to the right of the tier label.',
          },
          headline_line_1: { label: 'Headline · line 1', hint: 'First line of the big headline.' },
          headline_line_2: { label: 'Headline · line 2', hint: 'Second line of the headline.' },
          headline_emphasis: {
            label: 'Headline · italic emphasis',
            hint: 'The italic Fraunces word(s) at the end of the headline (e.g. "unbroken.").',
          },
          sub: {
            label: 'Sub-headline',
            hint: 'One sentence under the headline.',
          },
          primary_cta: { label: 'Primary button label', hint: 'Filled amber CTA — links to /request.' },
          secondary_cta: { label: 'Secondary button label', hint: 'Outlined cream CTA — links to /the-camp.' },
        },
      },
      story_split: {
        label: 'Story section',
        description: 'The cream "story split" section halfway down the home page.',
        fields: {
          eyebrow: { label: 'Eyebrow' },
          headline: { label: 'Headline' },
          body_p1: { label: 'First paragraph' },
          body_p2: { label: 'Second paragraph' },
          ilink_label: {
            label: 'Inline link label',
            hint: 'Text on the link that leads to /history.',
          },
        },
      },
      pull_quote: {
        label: 'Pull quote',
        description: 'The Du Bois quote at the bottom of the home page, just above the CTA band.',
        fields: {
          eyebrow: { label: 'Eyebrow' },
          quote: {
            label: 'Quote',
            hint: 'Quote marks added automatically — don\'t include them.',
          },
          citation: { label: 'Citation' },
        },
      },
    },
  },

  visit: {
    label: 'Visit',
    publicPath: '/visit',
    description:
      'Mode-aware copy on the Visit page — different headlines for "Host a retreat" vs "Stay at the lake".',
    blockOrder: ['hero', 'book'],
    blocks: {
      hero: {
        label: 'Visit hero',
        description:
          'The headline and lead change depending on which mode the visitor toggles.',
        fields: {
          host_headline_p1: {
            label: 'Host — headline first part',
            hint: 'Shown when the "Host a retreat" toggle is active.',
          },
          host_headline_emph: {
            label: 'Host — headline italic',
            hint: 'The italic emphasis word(s).',
          },
          host_lead: {
            label: 'Host — lead copy',
            hint: 'Sub-headline shown when "Host a retreat" is active.',
          },
          host_cta: {
            label: 'Host — CTA button label',
            hint: 'Scrolls to the date picker.',
          },
          buyout_headline_p1: {
            label: 'Stay — headline first part',
            hint: 'Shown when the "Stay at the lake" toggle is active.',
          },
          buyout_headline_emph: {
            label: 'Stay — headline italic',
            hint: 'The italic emphasis word(s).',
          },
          buyout_lead: {
            label: 'Stay — lead copy',
            hint: 'Sub-headline shown when "Stay at the lake" is active.',
          },
          buyout_cta: {
            label: 'Stay — CTA button label',
            hint: 'Scrolls to the date picker.',
          },
        },
      },
      book: {
        label: 'Below the calendar',
        description: 'Small bridge line under the inquiry form.',
        fields: {
          bridge_line: {
            label: 'Bridge line',
            hint: 'One line that points readers from the form to /request. The text after the em-dash becomes a link.',
          },
        },
      },
    },
  },
}

export function getPageMeta(page: string): PageMeta | null {
  return META[page] ?? null
}

export function blockMetaFor(page: string, block: string): BlockMeta {
  const m = META[page]?.blocks[block]
  if (m) return m
  return { label: humanize(block), fields: {} }
}

export function fieldMetaFor(
  page: string,
  block: string,
  field: string
): FieldMeta {
  const m = META[page]?.blocks[block]?.fields[field]
  if (m) return m
  return { label: humanize(field) }
}

export function orderedBlocksFor(
  page: string,
  blocks: string[]
): string[] {
  const order = META[page]?.blockOrder
  if (!order) return blocks
  const ordered = order.filter((b) => blocks.includes(b))
  const extras = blocks.filter((b) => !order.includes(b)).sort()
  return [...ordered, ...extras]
}

function humanize(key: string): string {
  return key
    .split('_')
    .map((w) => (w === w.toUpperCase() ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}
