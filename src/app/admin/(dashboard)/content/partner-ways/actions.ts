'use server'

import { revalidatePath } from 'next/cache'
import {
  insertWayItem,
  updateWayItem,
  deleteWayItem,
} from '@/lib/data/content-admin'

function revalidateAll() {
  revalidatePath('/partner')
  revalidatePath('/admin/content/partner-ways')
}

export async function createWayItem(input: {
  number: string
  title: string
  description: string
  sortOrder?: number
}) {
  const res = await insertWayItem(input)
  if (!('error' in res)) revalidateAll()
  return res
}

export async function saveWayItem(
  id: string,
  update: {
    number?: string
    title?: string
    description?: string
    sortOrder?: number
    isVisible?: boolean
  }
) {
  const res = await updateWayItem(id, update)
  if (!res.error) revalidateAll()
  return res
}

export async function removeWayItem(id: string) {
  const res = await deleteWayItem(id)
  if (!res.error) revalidateAll()
  return res
}
