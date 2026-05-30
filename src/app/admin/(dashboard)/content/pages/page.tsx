import { redirect } from 'next/navigation'

export default function PagesContentRedirect() {
  redirect('/admin/content?tab=pages')
}
