'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getAccountCredits } from '@/app/actions/nanobanana'

const REFRESH_EVENT = 'admanage:credits-refresh'

type CreditsContextValue = {
  balance: number | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  optimisticDecrement: () => void
}

const CreditsContext = createContext<CreditsContextValue | null>(null)

export function requestCreditsRefresh() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(REFRESH_EVENT))
  }
}

export function CreditsProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getAccountCredits()
      if (!result.ok) {
        throw new Error(result.error)
      }
      setBalance(result.credits)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not load credits.'
      setError(msg)
      setBalance(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const onRefresh = () => {
      void refresh()
    }
    window.addEventListener(REFRESH_EVENT, onRefresh)
    return () => window.removeEventListener(REFRESH_EVENT, onRefresh)
  }, [refresh])

  const optimisticDecrement = useCallback(() => {
    setBalance((b) => (b !== null ? b - 1 : b))
    requestCreditsRefresh()
  }, [])

  const value = useMemo(
    () => ({ balance, loading, error, refresh, optimisticDecrement }),
    [balance, loading, error, refresh, optimisticDecrement]
  )

  return <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
}

export function useCredits() {
  const ctx = useContext(CreditsContext)
  if (!ctx) {
    throw new Error('useCredits must be used within CreditsProvider')
  }
  return ctx
}
