import { createSupabaseServer } from '@/lib/supabase-server'
import WaitlistClient from './WaitlistClient'

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=64&h=64&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=64&h=64&fit=crop&crop=face',
]

export default async function Waitlist() {
  const supabase = await createSupabaseServer()
  const { data } = await supabase
    .from('site_content')
    .select('key, value')
    .eq('section', 'waitlist')

  const rows = data ?? []
  function c(key: string, fallback: string): string {
    return rows.find((r) => r.key === key)?.value || fallback
  }

  const socialProofImages = [
    c('social_proof_1', DEFAULT_IMAGES[0]),
    c('social_proof_2', DEFAULT_IMAGES[1]),
    c('social_proof_3', DEFAULT_IMAGES[2]),
    c('social_proof_4', DEFAULT_IMAGES[3]),
  ]

  return <WaitlistClient socialProofImages={socialProofImages} />
}
