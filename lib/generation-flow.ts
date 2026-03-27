/**
 * Client-callable flow: server actions for NanoBanana (no Route Handlers).
 */
import { getGenerationStatus, startImageGeneration } from '@/app/actions/nanobanana'

export async function startGenerationAndPoll(
  prompt: string,
  imageUrl?: string,
  imageSize?: string,
  onProgress?: () => void,
  maxWaitMs = 120_000
): Promise<string> {
  const started = await startImageGeneration(prompt, imageUrl, imageSize)
  if (!started.ok) {
    throw new Error(started.error)
  }

  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitMs) {
    const status = await getGenerationStatus(started.taskId)
    if (!status.ok) {
      throw new Error(status.error)
    }

    onProgress?.()

    if (status.successFlag === 1) {
      if (!status.imageUrl) {
        throw new Error('Generation complete but no image URL returned.')
      }
      return status.imageUrl
    }

    if (status.successFlag === 2 || status.successFlag === 3) {
      throw new Error(status.errorMessage ?? 'Generation failed.')
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  throw new Error('Generation timed out. Please try again.')
}
