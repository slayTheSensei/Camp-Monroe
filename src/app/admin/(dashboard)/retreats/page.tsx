import Link from 'next/link'
import { getHostInquiries, getStrInquiries } from '@/lib/data/retreats'
import InquiryInbox from '@/components/admin/retreats/InquiryInbox'

export const dynamic = 'force-dynamic'

export default async function RetreatsInboxPage() {
  const [hostInquiries, strInquiries] = await Promise.all([
    getHostInquiries(),
    getStrInquiries(),
  ])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retreats</h1>
          <p className="text-gray-500 text-sm mt-1">
            Host and STR inquiry pipeline.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/retreats/calendar"
            className="px-3 py-2 text-xs font-medium text-forest border border-forest/30 rounded-md hover:bg-forest/5 transition-colors"
          >
            Calendar
          </Link>
          <Link
            href="/admin/retreats/open-windows"
            className="px-3 py-2 text-xs font-medium text-forest border border-forest/30 rounded-md hover:bg-forest/5 transition-colors"
          >
            Open Windows
          </Link>
        </div>
      </div>

      <InquiryInbox hostInquiries={hostInquiries} strInquiries={strInquiries} />
    </div>
  )
}
