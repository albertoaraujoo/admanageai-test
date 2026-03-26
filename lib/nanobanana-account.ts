const API_BASE = 'https://api.nanobananaapi.ai'

interface CreditApiResponse {
  code: number
  msg: string
  data: number
}

/**
 * Fetches remaining account credits from NanoBanana (server-only).
 * @see https://docs.nanobananaapi.ai/common-api/get-account-credits
 */
export async function fetchNanoBananaAccountCredits(apiKey: string): Promise<number> {
  const res = await fetch(`${API_BASE}/api/v1/common/credit`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    next: { revalidate: 0 },
  })

  const json = (await res.json()) as CreditApiResponse

  if (!res.ok || json.code !== 200) {
    throw new Error(json.msg || 'Failed to fetch account credits.')
  }

  const raw = json.data
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (Number.isNaN(n) || !Number.isFinite(n)) {
    throw new Error('Invalid credits response from API.')
  }

  return Math.max(0, n)
}
