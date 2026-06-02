'use server'

import { revalidatePath } from 'next/cache'
import {
  updatePartnerInquiry,
  type InquiryUpdate,
} from '@/lib/data/inquiries'

export async function savePartnerUpdate(
  id: string,
  update: InquiryUpdate
): Promise<{ error?: string }> {
  const res = await updatePartnerInquiry(id, update)
  if (res.error) return res
  revalidatePath(`/admin/partner-inquiries/${id}`)
  revalidatePath('/admin/partner-inquiries')
  revalidatePath('/admin')
  return {}
}
