/**
 * Server-only NanoBanana API helpers.
 * Uses NANO_BANANA_API_KEY — call from Server Actions or Server Components only.
 */

const BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana'

interface GenerateParams {
  prompt: string
  /** HTTPS image URL to use as the source for image-to-image generation. */
  imageUrl?: string
  /** Aspect ratio for the generated image (e.g. '1:1', '9:16', '16:9'). */
  imageSize?: string
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

  const isImageToImage = Boolean(params.imageUrl?.startsWith('https://'))

  // Note: "IMAGETOIAMGE" and "TEXTTOIAMGE" are the exact strings the API expects
  // (the documentation itself has these deliberate typos — "IMAGE" vs "IAMGE").
  const requestBody: Record<string, unknown> = {
    prompt: params.prompt,
    type: isImageToImage ? 'IMAGETOIAMGE' : 'TEXTTOIAMGE',
    numImages: 1,
    callBackUrl: `${process.env.NEXTAUTH_URL ?? 'https://example.com'}/api/nanobanana-webhook`,
    ...(params.imageSize && { image_size: params.imageSize }),
  }

  if (isImageToImage && params.imageUrl) {
    requestBody.imageUrls = [params.imageUrl]
  }

  console.log('[NanaBanana] → POST /generate', JSON.stringify(requestBody))

  const res = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  const json: GenerateResponse = await res.json()
  console.log('[NanaBanana] ← response', res.status, JSON.stringify(json))

  if (!res.ok || json.code !== 200) {
    throw new Error(`[${json.code ?? res.status}] ${json.msg || 'Failed to start generation.'}`)
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
