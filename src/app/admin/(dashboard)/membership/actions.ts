'use server'

import { revalidatePath } from 'next/cache'
import {
  updateMembershipRequest,
  type FrontDoorUpdate,
} from '@/lib/data/front-door'

export async function saveMembershipUpdate(
  id: string,
  update: FrontDoorUpdate
): Promise<{ error?: string }> {
  const res = await updateMembershipRequest(id, update)
  if (res.error) return res
  revalidatePath(`/admin/membership/${id}`)
  revalidatePath('/admin/membership')
  revalidatePath('/admin')
  return {}
}
