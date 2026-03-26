/**
 * Server-only NanoBanana API helpers.
 * Uses NANO_BANANA_API_KEY — call from Server Actions or Server Components only.
 */

const BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana'

interface GenerateParams {
  prompt: string
  /** HTTPS image URL to use as the source for image-to-image generation. */
  imageUrl?: string
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
      type: params.imageUrl?.startsWith('https://') ? 'IMAGETOIMAGE' : 'TEXTTOIMAGE',
      numImages: 1,
      ...(params.imageUrl?.startsWith('https://') && { image_url: params.imageUrl }),
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
    cache: 'no-store',
  })

  const json: TaskStatusResponse = await res.json()
  if (!res.ok) throw new Error(json.msg || 'Failed to query status.')

  return json.data
}
