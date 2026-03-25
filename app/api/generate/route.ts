import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana'

interface NanoBananaGenerateResponse {
  code: number
  msg: string
  data: { taskId: string }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.NANO_BANANA_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured on the server.' },
      { status: 500 }
    )
  }

  const body = await request.json().catch(() => null)
  if (!body?.prompt || typeof body.prompt !== 'string') {
    return NextResponse.json(
      { error: 'Missing required field: prompt.' },
      { status: 400 }
    )
  }

  const { prompt, credits } = body as { prompt: string; credits: number }

  if (typeof credits !== 'number' || credits <= 0) {
    return NextResponse.json(
      { error: 'Insufficient credits. Please upgrade your plan.' },
      { status: 402 }
    )
  }

  try {
    const res = await fetch(`${BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        type: 'TEXTTOIAMGE',
        numImages: 1,
      }),
    })

    const json: NanoBananaGenerateResponse = await res.json()

    if (!res.ok || json.code !== 200) {
      return NextResponse.json(
        { error: json.msg || 'Failed to start generation.' },
        { status: res.status }
      )
    }

    return NextResponse.json({ taskId: json.data.taskId })
  } catch (err) {
    console.error('[/api/generate] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error during generation.' },
      { status: 500 }
    )
  }
}
