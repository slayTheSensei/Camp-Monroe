import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'

type Props = {
  recipientName: string
  startDate: string
  endDate: string
  holdExpiresAt: string
}

export default function HoldEmail({ recipientName, startDate, endDate, holdExpiresAt }: Props) {
  const expiry = new Date(holdExpiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  return (
    <Html>
      <Head />
      <Preview>We&apos;ve placed a soft hold on your dates</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Camp Monroe</Heading>
          <Text style={text}>Hello {recipientName},</Text>
          <Text style={text}>
            We&apos;ve placed a soft hold on <strong>{startDate} – {endDate}</strong> while we
            finalize the details of your inquiry. We&apos;ll follow up with next steps by{' '}
            <strong>{expiry}</strong>.
          </Text>
          <Text style={text}>
            If anything changes on your side — group size, dates, concept — let us know as soon as
            you can by replying to this message.
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
const signature = { marginTop: '32px', borderTop: '1px solid #d4a843', paddingTop: '16px' }
const signatureText = { color: '#5c3d2e', fontSize: '14px', margin: '4px 0', fontFamily: 'Helvetica, Arial, sans-serif' }
