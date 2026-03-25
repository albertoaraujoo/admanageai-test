/**
 * Server-side NanoBanana API client.
 * Uses NANO_BANANA_API_KEY (no NEXT_PUBLIC prefix).
 * Never import this directly from client components — use the /api/generate routes instead.
 */

const BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana'

interface GenerateParams {
  prompt: string
}

interface GenerateResponse {
  code: number
  msg: string
  data: { taskId: string }
}

interface TaskStatusResponse {
  code: number
  msg: string
  data: {
    taskId: string
    successFlag: 0 | 1 | 2 | 3
    errorMessage?: string
    response?: { resultImageUrl: string }
  }
}

export async function serverGenerateImage(params: GenerateParams): Promise<string> {
  const apiKey = process.env.NANO_BANANA_API_KEY
  if (!apiKey) throw new Error('API key not configured.')

  const res = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: params.prompt,
      type: 'TEXTTOIAMGE',
      numImages: 1,
    }),
  })

  const json: GenerateResponse = await res.json()
  if (!res.ok || json.code !== 200) {
    throw new Error(json.msg || 'Failed to start generation.')
  }

  return json.data.taskId
}

export async function serverGetTaskStatus(taskId: string): Promise<TaskStatusResponse['data']> {
  const apiKey = process.env.NANO_BANANA_API_KEY
  if (!apiKey) throw new Error('API key not configured.')

  const res = await fetch(`${BASE_URL}/record-info?taskId=${taskId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  const json: TaskStatusResponse = await res.json()
  if (!res.ok) throw new Error(json.msg || 'Failed to query status.')

  return json.data
}

/**
 * Client-side helper: calls our secure /api/generate route.
 */
export async function clientStartGeneration(prompt: string, credits: number): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, credits }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Failed to start generation.')

  return json.taskId as string
}

/**
 * Client-side helper: polls our secure /api/generate/status route.
 */
export async function clientPollStatus(
  taskId: string,
  onProgress?: () => void,
  maxWaitMs = 120_000
): Promise<string> {
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitMs) {
    const res = await fetch(`/api/generate/status?taskId=${taskId}`)
    const json = await res.json()

    if (!res.ok) throw new Error(json.error || 'Failed to check status.')

    onProgress?.()

    const { successFlag, imageUrl, errorMessage } = json as {
      successFlag: 0 | 1 | 2 | 3
      imageUrl: string | null
      errorMessage: string | null
    }

    if (successFlag === 1) {
      if (!imageUrl) throw new Error('Generation complete but no image URL returned.')
      return imageUrl
    }

    if (successFlag === 2 || successFlag === 3) {
      throw new Error(errorMessage ?? 'Generation failed.')
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  throw new Error('Generation timed out. Please try again.')
}
