import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'AdManage AI — Gerador de Anúncios com IA',
  description:
    'Crie anúncios de imagem de alta conversão com inteligência artificial. Navegue por modelos, importe produtos e gere criativos em segundos.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="h-full bg-surface text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
