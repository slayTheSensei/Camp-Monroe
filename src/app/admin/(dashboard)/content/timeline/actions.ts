'use server'

import { revalidatePath } from 'next/cache'
import {
  insertTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from '@/lib/data/content-admin'

function revalidateAll() {
  revalidatePath('/history')
  revalidatePath('/admin/content/timeline')
}

export async function createTimelineItem(input: {
  year: string
  head: string
  body: string
  sortOrder?: number
}) {
  const res = await insertTimelineItem(input)
  if (!('error' in res)) revalidateAll()
  return res
}

export async function saveTimelineItem(
  id: string,
  update: {
    year?: string
    head?: string
    body?: string
    sortOrder?: number
    isVisible?: boolean
  }
) {
  const res = await updateTimelineItem(id, update)
  if (!res.error) revalidateAll()
  return res
}

export async function removeTimelineItem(id: string) {
  const res = await deleteTimelineItem(id)
  if (!res.error) revalidateAll()
  return res
}
