const BASE_URL = 'https://api.nanobananaapi.ai/api/v1/nanobanana'

interface GenerateParams {
  prompt: string
  callBackUrl?: string
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
    response?: {
      resultImageUrl: string
    }
  }
}

async function generateImage(params: GenerateParams): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_NANOBANANA_API_KEY
  if (!apiKey) throw new Error('Chave de API não configurada.')

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
      ...(params.callBackUrl && { callBackUrl: params.callBackUrl }),
    }),
  })

  const json: GenerateResponse = await res.json()
  if (!res.ok || json.code !== 200) {
    throw new Error(json.msg || 'Falha ao iniciar geração.')
  }

  return json.data.taskId
}

async function getTaskStatus(taskId: string): Promise<TaskStatusResponse['data']> {
  const apiKey = process.env.NEXT_PUBLIC_NANOBANANA_API_KEY
  if (!apiKey) throw new Error('Chave de API não configurada.')

  const res = await fetch(`${BASE_URL}/record-info?taskId=${taskId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  const json: TaskStatusResponse = await res.json()
  if (!res.ok) throw new Error(json.msg || 'Falha ao consultar status.')

  return json.data
}

async function waitForCompletion(
  taskId: string,
  onProgress?: () => void,
  maxWaitMs = 120_000
): Promise<string> {
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitMs) {
    const status = await getTaskStatus(taskId)
    onProgress?.()

    switch (status.successFlag) {
      case 1:
        if (!status.response?.resultImageUrl) {
          throw new Error('Imagem gerada mas URL não encontrada.')
        }
        return status.response.resultImageUrl
      case 2:
      case 3:
        throw new Error(status.errorMessage ?? 'Geração falhou.')
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  throw new Error('Timeout na geração da imagem.')
}

export const nanobanana = { generateImage, waitForCompletion }
