'use server'

import { fetchNanoBananaAccountCredits } from '@/lib/nanobanana-account'
import { serverGenerateImage, serverGetTaskStatus } from '@/lib/nanobanana'

export type GetCreditsResult =
  | { ok: true; credits: number }
  | { ok: false; error: string }

export type StartGenerationResult =
  | { ok: true; taskId: string }
  | { ok: false; error: string }

export type GenerationStatusResult =
  | {
      ok: true
      successFlag: 0 | 1 | 2 | 3
      imageUrl: string | null
      errorMessage: string | null
    }
  | { ok: false; error: string }

function requireApiKey(): string | null {
  return process.env.NANO_BANANA_API_KEY ?? null
}

export async function getAccountCredits(): Promise<GetCreditsResult> {
  const apiKey = requireApiKey()
  if (!apiKey) {
    return { ok: false, error: 'API key not configured on the server.' }
  }

  try {
    const credits = await fetchNanoBananaAccountCredits(apiKey)
    return { ok: true, credits }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to load credits.'
    return { ok: false, error: message }
  }
}

export async function startImageGeneration(
  prompt: string,
  imageUrl?: string
): Promise<StartGenerationResult> {
  const apiKey = requireApiKey()
  if (!apiKey) {
    return { ok: false, error: 'API key not configured on the server.' }
  }

  const trimmed = typeof prompt === 'string' ? prompt.trim() : ''
  if (!trimmed) {
    return { ok: false, error: 'Prompt is required.' }
  }

  try {
    const remaining = await fetchNanoBananaAccountCredits(apiKey)
    if (remaining <= 0) {
      return {
        ok: false,
        error: 'Insufficient API credits. Add credits in your NanoBanana account.',
      }
    }
  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : 'Could not verify account credits. Check your API key.'
    return { ok: false, error: message }
  }

  try {
    const taskId = await serverGenerateImage({ prompt: trimmed, imageUrl })
    return { ok: true, taskId }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to start generation.'
    return { ok: false, error: message }
  }
}

export async function getGenerationStatus(taskId: string): Promise<GenerationStatusResult> {
  const apiKey = requireApiKey()
  if (!apiKey) {
    return { ok: false, error: 'API key not configured on the server.' }
  }

  const id = typeof taskId === 'string' ? taskId.trim() : ''
  if (!id) {
    return { ok: false, error: 'Missing task id.' }
  }

  try {
    const data = await serverGetTaskStatus(id)
    return {
      ok: true,
      successFlag: data.successFlag,
      imageUrl: data.response?.resultImageUrl ?? null,
      errorMessage: data.errorMessage ?? null,
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to check status.'
    return { ok: false, error: message }
  }
}
