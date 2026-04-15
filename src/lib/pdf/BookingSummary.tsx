import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Booking, HostInquiry, StrInquiry, InquiryType } from '@/lib/types/retreats'

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Helvetica', fontSize: 11, color: '#1a2e1a', backgroundColor: '#f5f0e8' },
  header: { borderBottom: '2 solid #d4a843', paddingBottom: 12, marginBottom: 24 },
  heading: { fontSize: 20, letterSpacing: 2, textTransform: 'uppercase', color: '#1a2e1a', marginBottom: 4 },
  subheading: { fontSize: 10, color: '#5c3d2e', letterSpacing: 1 },
  section: { marginBottom: 16 },
  label: { fontSize: 9, color: '#5c3d2e', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  value: { fontSize: 12, color: '#1a2e1a', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 24, marginBottom: 8 },
  col: { flex: 1 },
  divider: { height: 1, backgroundColor: '#d4a843', marginVertical: 12 },
  footer: { marginTop: 32, borderTop: '1 solid #d4a843', paddingTop: 12, fontSize: 9, color: '#5c3d2e' },
})

type Props = {
  booking: Booking
  inquiry: HostInquiry | StrInquiry
  type: InquiryType
}

export default function BookingSummary({ booking, inquiry, type }: Props) {
  const isHost = type === 'host'
  const host = isHost ? (inquiry as HostInquiry) : null
  const str = !isHost ? (inquiry as StrInquiry) : null

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.heading}>Camp Monroe</Text>
          <Text style={styles.subheading}>
            {isHost ? 'Retreat Booking Confirmation' : 'Stay Confirmation'} · #{booking.id.slice(0, 8)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Confirmed dates</Text>
          <Text style={styles.value}>
            {booking.startDate} – {booking.endDate}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{inquiry.name}</Text>
          </View>
          {host?.organization ? (
            <View style={styles.col}>
              <Text style={styles.label}>Organization</Text>
              <Text style={styles.value}>{host.organization}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{inquiry.email}</Text>
          </View>
          {booking.groupSize ? (
            <View style={styles.col}>
              <Text style={styles.label}>Group size</Text>
              <Text style={styles.value}>{booking.groupSize}</Text>
            </View>
          ) : null}
        </View>

        {host ? (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.label}>Retreat concept</Text>
              <Text style={styles.value}>{host.retreatConcept}</Text>
            </View>
            {host.supportNeeds && host.supportNeeds.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.label}>Support needs</Text>
                <Text style={styles.value}>{host.supportNeeds.join(', ')}</Text>
              </View>
            ) : null}
          </>
        ) : null}

        {str ? (
          <>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Party size</Text>
                <Text style={styles.value}>{str.partySize ?? '—'}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Purpose</Text>
                <Text style={styles.value}>{str.purposeOfStay ?? '—'}</Text>
              </View>
            </View>
          </>
        ) : null}

        {booking.notes ? (
          <View style={styles.section}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{booking.notes}</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text>
            Camp Monroe · Lake Cobbosseecontee, West Gardiner, Maine · monroemaine.com
          </Text>
          <Text style={{ marginTop: 4 }}>
            Confirmed {new Date(booking.confirmedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
