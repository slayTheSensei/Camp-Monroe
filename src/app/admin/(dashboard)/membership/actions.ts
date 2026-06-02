'use server'

import { revalidatePath } from 'next/cache'
import {
  updateMembershipRequest,
  type InquiryUpdate,
} from '@/lib/data/inquiries'

export async function saveMembershipUpdate(
  id: string,
  update: InquiryUpdate
): Promise<{ error?: string }> {
  const res = await updateMembershipRequest(id, update)
  if (res.error) return res
  revalidatePath(`/admin/membership/${id}`)
  revalidatePath('/admin/membership')
  revalidatePath('/admin')
  return {}
}
