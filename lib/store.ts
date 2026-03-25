import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/types/product'
import type { GeneratedProject } from '@/types/project'

const INITIAL_CREDITS = 50

interface AppStore {
  credits: number
  isPro: boolean
  products: Product[]
  generatedProjects: GeneratedProject[]
  spendCredit: () => boolean
  upgradeToPro: () => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  addProject: (project: GeneratedProject) => void
  updateProject: (id: string, updates: Partial<GeneratedProject>) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      credits: INITIAL_CREDITS,
      isPro: false,
      products: [],
      generatedProjects: [],

      spendCredit: () => {
        const { credits } = get()
        if (credits <= 0) return false
        set((state) => ({ credits: state.credits - 1 }))
        return true
      },

      upgradeToPro: () => {
        set({ isPro: true })
      },

      addProduct: (product) => {
        set((state) => ({ products: [product, ...state.products] }))
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }))
      },

      addProject: (project) => {
        set((state) => ({
          generatedProjects: [project, ...state.generatedProjects],
        }))
      },

      updateProject: (id, updates) => {
        set((state) => ({
          generatedProjects: state.generatedProjects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }))
      },
    }),
    {
      name: 'admanage-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
