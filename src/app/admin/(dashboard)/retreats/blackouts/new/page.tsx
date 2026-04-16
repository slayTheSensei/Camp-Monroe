import BlackoutEditor from '@/components/admin/retreats/BlackoutEditor'
import PageHeader from '@/components/admin/ui/PageHeader'

export default function NewBlackoutPage() {
  return (
    <>
      <PageHeader
        title="New Blackout"
        subtitle="Block dates from public availability."
        back={{ href: '/admin/retreats/blackouts', label: 'Back to Blackouts' }}
      />
      <BlackoutEditor isNew />
    </>
  )
}
