import { NextResponse } from 'next/server'
import { fetchNanoBananaAccountCredits } from '@/lib/nanobanana-account'

export async function GET() {
  const apiKey = process.env.NANO_BANANA_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured on the server.' },
      { status: 500 }
    )
  }

  try {
    const credits = await fetchNanoBananaAccountCredits(apiKey)
    return NextResponse.json({ credits })
  } catch (err) {
    console.error('[/api/credits] Error:', err)
    const message = err instanceof Error ? err.message : 'Failed to load credits.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
