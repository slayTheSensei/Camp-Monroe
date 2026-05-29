'use client'

import OrderedItemsEditor, {
  type EditableField,
} from '@/components/admin/content/OrderedItemsEditor'
import type { TimelineItem } from '@/lib/types/content'
import {
  createTimelineItem,
  saveTimelineItem,
  removeTimelineItem,
} from './actions'

const FIELDS: EditableField[] = [
  { key: 'year', label: 'Year', type: 'text', short: true, placeholder: 'e.g. 1893, 1920s, Mid-c.' },
  { key: 'head', label: 'Headline', type: 'text', placeholder: 'Short, sentence case.' },
  { key: 'body', label: 'Body', type: 'longtext', placeholder: 'One paragraph. The whole beat.' },
]

type Row = {
  id: string
  year: string
  head: string
  body: string
  sortOrder: number
  isVisible: boolean
}

export default function TimelineAdmin({ items }: { items: TimelineItem[] }) {
  const rows: Row[] = items.map((i) => ({
    id: i.id,
    year: i.year,
    head: i.head,
    body: i.body,
    sortOrder: i.sortOrder,
    isVisible: i.isVisible,
  }))

  return (
    <OrderedItemsEditor<Row>
      items={rows}
      fields={FIELDS}
      noun="timeline item"
      emptyTemplate={{
        year: '',
        head: '',
        body: '',
        sortOrder: (rows[rows.length - 1]?.sortOrder ?? 0) + 10,
        isVisible: true,
      }}
      onCreate={(input) =>
        createTimelineItem({
          year: input.year as string,
          head: input.head as string,
          body: input.body as string,
          sortOrder: input.sortOrder as number,
        })
      }
      onSave={(id, update) =>
        saveTimelineItem(id, {
          year: update.year as string | undefined,
          head: update.head as string | undefined,
          body: update.body as string | undefined,
          sortOrder: update.sortOrder as number | undefined,
          isVisible: update.isVisible as boolean | undefined,
        })
      }
      onDelete={removeTimelineItem}
    />
  )
}
