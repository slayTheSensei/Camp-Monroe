import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'

type Props = {
  recipientName: string
  reason: string
}

export default function DeclineEmail({ recipientName, reason }: Props) {
  return (
    <Html>
      <Head />
      <Preview>A note on your Camp Monroe inquiry</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Camp Monroe</Heading>
          <Text style={text}>Hello {recipientName},</Text>
          <Text style={text}>{reason}</Text>
          <Text style={text}>
            If your plans shift, you&apos;re welcome to reach back out. We keep a running list of
            partners and prospects we&apos;d love to host down the line.
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
