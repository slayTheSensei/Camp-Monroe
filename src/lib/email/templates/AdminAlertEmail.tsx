import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from '@react-email/components'

type Props = {
  inquiryKind: 'host' | 'str'
  name: string
  organization?: string | null
  email: string
  summary: string
  adminUrl: string
}

export default function AdminAlertEmail({ inquiryKind, name, organization, email, summary, adminUrl }: Props) {
  const heading = inquiryKind === 'host' ? 'New retreat inquiry' : 'New stay request'
  return (
    <Html>
      <Head />
      <Preview>{heading} — {name}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h}>{heading}</Heading>
          <Section style={card}>
            <Text style={label}>From</Text>
            <Text style={value}>
              {name}
              {organization ? ` — ${organization}` : ''}
            </Text>
            <Text style={label}>Email</Text>
            <Text style={value}>{email}</Text>
            <Text style={label}>Summary</Text>
            <Text style={value}>{summary}</Text>
          </Section>
          <Text style={text}>
            <Link href={adminUrl} style={link}>
              Open in admin →
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const body = { backgroundColor: '#f5f0e8', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: 0 }
const container = { margin: '0 auto', padding: '32px 24px', maxWidth: '560px' }
const h = { color: '#1a2e1a', fontSize: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: '16px' }
const card = { backgroundColor: '#ffffff', border: '1px solid #e5e5e5', padding: '16px', borderRadius: '4px', margin: '8px 0 16px' }
const label = { color: '#888', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, margin: '10px 0 2px' }
const value = { color: '#1a2e1a', fontSize: '14px', margin: 0 }
const text = { color: '#1a2e1a', fontSize: '14px', lineHeight: '1.6' }
const link = { color: '#1a2e1a', fontWeight: 600, textDecoration: 'underline' }
