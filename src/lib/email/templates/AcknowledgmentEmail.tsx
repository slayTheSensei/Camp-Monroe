import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

type Props = {
  recipientName: string
  inquiryKind: 'host' | 'buyout'
}

export default function AcknowledgmentEmail({ recipientName, inquiryKind }: Props) {
  const subject =
    inquiryKind === 'host'
      ? 'We received your retreat inquiry'
      : 'Thanks for your camp buyout request'

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Camp Monroe</Heading>
          <Text style={text}>Hello {recipientName},</Text>
          {inquiryKind === 'host' ? (
            <>
              <Text style={text}>
                Thank you for reaching out about hosting a retreat at Camp Monroe. We review every
                inquiry personally, and you&apos;ll hear back from us within 48 hours.
              </Text>
              <Text style={text}>
                In the meantime, if there&apos;s anything else you&apos;d like us to know about
                your retreat concept or group, simply reply to this email.
              </Text>
            </>
          ) : (
            <>
              <Text style={text}>
                Thanks for your request to stay at Camp Monroe. A stay with us is a private
                whole-property buyout — we review every request personally and will confirm your
                dates or offer alternatives within 48 hours.
              </Text>
            </>
          )}
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
