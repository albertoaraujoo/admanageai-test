import { Suspense } from 'react'
import { ProductForm } from '@/components/products/product-form'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Produtos — AdManage AI',
}

function ProductFormSkeleton() {
  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Setup do Produto
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Cadastre as informações do seu produto para gerar anúncios personalizados.
        </p>
      </div>

      <div className="max-w-2xl">
        <Suspense fallback={<ProductFormSkeleton />}>
          <ProductForm />
        </Suspense>
      </div>
    </div>
  )
}
