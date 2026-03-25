type ToastVariant = 'success' | 'error' | 'info'

interface ToastEvent {
  message: string
  variant: ToastVariant
  id: string
}

type ToastListener = (toast: ToastEvent) => void

const listeners: ToastListener[] = []

function emit(message: string, variant: ToastVariant) {
  const event: ToastEvent = {
    message,
    variant,
    id: `${Date.now()}-${Math.random()}`,
  }
  listeners.forEach((fn) => fn(event))
}

export const toast = {
  success: (message: string) => emit(message, 'success'),
  error: (message: string) => emit(message, 'error'),
  info: (message: string) => emit(message, 'info'),
  subscribe: (fn: ToastListener) => {
    listeners.push(fn)
    return () => {
      const idx = listeners.indexOf(fn)
      if (idx !== -1) listeners.splice(idx, 1)
    }
  },
}

export type { ToastEvent, ToastVariant }
