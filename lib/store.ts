import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/types/product'
import type { GeneratedProject } from '@/types/project'

export interface MockUser {
  id: string
  name: string
  email: string
  avatarInitials: string
}

const MOCK_USER: MockUser = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex@admanage.ai',
  avatarInitials: 'AJ',
}

interface AppStore {
  isLoggedIn: boolean
  user: MockUser | null
  isPro: boolean
  products: Product[]
  generatedProjects: GeneratedProject[]
  login: () => void
  logout: () => void
  upgradeToPro: () => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  addProject: (project: GeneratedProject) => void
  updateProject: (id: string, updates: Partial<GeneratedProject>) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      isPro: false,
      products: [],
      generatedProjects: [],

      login: () => {
        document.cookie = 'admanage-auth=1; path=/; max-age=604800'
        set({
          isLoggedIn: true,
          user: MOCK_USER,
          isPro: false,
        })
      },

      logout: () => {
        document.cookie = 'admanage-auth=; path=/; max-age=0'
        set({
          isLoggedIn: false,
          user: null,
          products: [],
          generatedProjects: [],
        })
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
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        isPro: state.isPro,
        products: state.products,
        generatedProjects: state.generatedProjects,
      }),
    }
  )
)
