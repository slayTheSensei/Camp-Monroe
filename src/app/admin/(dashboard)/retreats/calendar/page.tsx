import {
  getOpenWindows,
  getBookings,
  getHostInquiries,
  getStrInquiries,
} from '@/lib/data/retreats'
import RetreatsCalendar from '@/components/admin/retreats/RetreatsCalendar'

export const dynamic = 'force-dynamic'

export default async function RetreatsCalendarPage() {
  const [openWindows, bookings, hostInquiries, strInquiries] = await Promise.all([
    getOpenWindows(),
    getBookings(),
    getHostInquiries({ status: 'hold' }),
    getStrInquiries({ status: 'hold' }),
  ])

  const holds = [
    ...hostInquiries.map((h) => ({
      id: h.id,
      type: 'host' as const,
      start: h.prefStart1,
      end: h.prefEnd1,
      label: `Hold — ${h.organization || h.name}`,
    })),
    ...strInquiries.map((s) => ({
      id: s.id,
      type: 'str' as const,
      start: s.startDate,
      end: s.endDate,
      label: `STR Hold — ${s.name}`,
    })),
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Retreats Calendar</h1>
        <p className="text-gray-500 text-sm mt-1">
          Month view of open windows, holds, and confirmed bookings.
        </p>
      </div>
      <RetreatsCalendar openWindows={openWindows} bookings={bookings} holds={holds} />
    </div>
  )
}
