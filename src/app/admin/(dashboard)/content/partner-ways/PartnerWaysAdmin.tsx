'use client'

import OrderedItemsEditor, {
  type EditableField,
} from '@/components/admin/content/OrderedItemsEditor'
import type { WayToPartnerItem } from '@/lib/types/content'
import { createWayItem, saveWayItem, removeWayItem } from './actions'

const FIELDS: EditableField[] = [
  { key: 'number', label: 'Number', type: 'text', short: true, placeholder: '01, 02 …' },
  { key: 'title', label: 'Title', type: 'text', placeholder: 'Short title with an ampersand.' },
  { key: 'description', label: 'Description', type: 'longtext', placeholder: 'One short paragraph.' },
]

type Row = {
  id: string
  number: string
  title: string
  description: string
  sortOrder: number
  isVisible: boolean
}

export default function PartnerWaysAdmin({
  items,
}: {
  items: WayToPartnerItem[]
}) {
  const rows: Row[] = items.map((i) => ({
    id: i.id,
    number: i.number,
    title: i.title,
    description: i.description,
    sortOrder: i.sortOrder,
    isVisible: i.isVisible,
  }))

  return (
    <OrderedItemsEditor<Row>
      items={rows}
      fields={FIELDS}
      noun="way to partner"
      emptyTemplate={{
        number: '',
        title: '',
        description: '',
        sortOrder: (rows[rows.length - 1]?.sortOrder ?? 0) + 10,
        isVisible: true,
      }}
      onCreate={(input) =>
        createWayItem({
          number: input.number as string,
          title: input.title as string,
          description: input.description as string,
          sortOrder: input.sortOrder as number,
        })
      }
      onSave={(id, update) =>
        saveWayItem(id, {
          number: update.number as string | undefined,
          title: update.title as string | undefined,
          description: update.description as string | undefined,
          sortOrder: update.sortOrder as number | undefined,
          isVisible: update.isVisible as boolean | undefined,
        })
      }
      onDelete={removeWayItem}
    />
  )
}
