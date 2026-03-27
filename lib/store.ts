import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/types/product'
import type { GeneratedProject } from '@/types/project'

interface AppStore {
  isPro: boolean
  products: Product[]
  generatedProjects: GeneratedProject[]
  clearWorkspace: () => void
  upgradeToPro: () => void
  downgradeToPro: () => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addProject: (project: GeneratedProject) => void
  updateProject: (id: string, updates: Partial<GeneratedProject>) => void
  deleteProject: (id: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isPro: false,
      products: [],
      generatedProjects: [],

      clearWorkspace: () => {
        set({ products: [], generatedProjects: [] })
      },

      upgradeToPro: () => {
        set({ isPro: true })
      },

      downgradeToPro: () => {
        set({ isPro: false })
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

      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }))
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

      deleteProject: (id) => {
        set((state) => ({
          generatedProjects: state.generatedProjects.filter((p) => p.id !== id),
        }))
      },
    }),
    {
      name: 'admanage-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isPro: state.isPro,
        products: state.products,
        generatedProjects: state.generatedProjects,
      }),
    }
  )
)
