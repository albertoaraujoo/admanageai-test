import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana'

interface TaskStatusResponse {
  code: number
  msg: string
  data: {
    taskId: string
    successFlag: 0 | 1 | 2 | 3
    errorMessage?: string
    response?: {
      resultImageUrl: string
    }
  }
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.NANO_BANANA_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured on the server.' },
      { status: 500 }
    )
  }

  const taskId = request.nextUrl.searchParams.get('taskId')
  if (!taskId) {
    return NextResponse.json(
      { error: 'Missing required param: taskId.' },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(`${BASE_URL}/record-info?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 0 },
    })

    const json: TaskStatusResponse = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: json.msg || 'Failed to query status.' },
        { status: res.status }
      )
    }

    const { successFlag, errorMessage, response } = json.data

    return NextResponse.json({
      successFlag,
      imageUrl: response?.resultImageUrl ?? null,
      errorMessage: errorMessage ?? null,
    })
  } catch (err) {
    console.error('[/api/generate/status] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error while checking status.' },
      { status: 500 }
    )
  }
}
