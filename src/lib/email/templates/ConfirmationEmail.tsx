import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from '@react-email/components'

type Props = {
  recipientName: string
  startDate: string
  endDate: string
  groupSize?: number | null
  pdfUrl?: string | null
  bookingId: string
  inquiryKind: 'host' | 'str'
}

export default function ConfirmationEmail({
  recipientName,
  startDate,
  endDate,
  groupSize,
  pdfUrl,
  bookingId,
  inquiryKind,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your Camp Monroe dates are confirmed</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Camp Monroe</Heading>
          <Text style={text}>Hello {recipientName},</Text>
          <Text style={text}>
            Your dates are confirmed. We&apos;re looking forward to welcoming you to Camp Monroe.
          </Text>
          <Section style={card}>
            <Text style={cardLabel}>Dates</Text>
            <Text style={cardValue}>{startDate} – {endDate}</Text>
            {groupSize ? (
              <>
                <Text style={cardLabel}>Group size</Text>
                <Text style={cardValue}>{groupSize}</Text>
              </>
            ) : null}
            <Text style={cardLabel}>Confirmation</Text>
            <Text style={cardValue}>#{bookingId.slice(0, 8)}</Text>
          </Section>
          {pdfUrl ? (
            <Text style={text}>
              Your booking summary is available here:{' '}
              <Link href={pdfUrl} style={link}>
                download PDF
              </Link>{' '}
              (link valid for 30 days).
            </Text>
          ) : null}
          <Text style={text}>
            {inquiryKind === 'host'
              ? "We'll follow up with logistics, arrival details, and support coordination as the date approaches."
              : 'Arrival information and check-in details will follow closer to your stay.'}
          </Text>
          <Section style={signature}>
            <Text style={signatureText}>Warmly,</Text>
            <Text style={signatureText}>The Camp Monroe team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body = { backgroundColor: '#f5f0e8', fontFamily: 'Georgia, serif', margin: 0, padding: 0 }
const container = { margin: '0 auto', padding: '40px 24px', maxWidth: '560px' }
const heading = { color: '#1a2e1a', fontSize: '24px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontStyle: 'italic' as const, marginBottom: '24px' }
const text = { color: '#1a2e1a', fontSize: '16px', lineHeight: '1.6', fontFamily: 'Helvetica, Arial, sans-serif' }
const card = { backgroundColor: '#ffffff', border: '1px solid #d4a843', padding: '20px', borderRadius: '4px', margin: '16px 0' }
const cardLabel = { color: '#5c3d2e', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, margin: '12px 0 2px', fontFamily: 'Helvetica, Arial, sans-serif' }
const cardValue = { color: '#1a2e1a', fontSize: '16px', margin: 0, fontFamily: 'Helvetica, Arial, sans-serif' }
const link = { color: '#1a2e1a', textDecoration: 'underline' }
const signature = { marginTop: '32px', borderTop: '1px solid #d4a843', paddingTop: '16px' }
const signatureText = { color: '#5c3d2e', fontSize: '14px', margin: '4px 0', fontFamily: 'Helvetica, Arial, sans-serif' }
