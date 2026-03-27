'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { Ad } from '@/types/ad'
import { RecreateModal } from './recreate-modal'
import { ModalPortal } from '@/components/ui/modal-portal'

interface RecreateButtonProps {
  ad: Ad
}

export function RecreateButton({ ad }: RecreateButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-xl border border-primary/50 bg-linear-to-r from-primary/90 to-blue-500/80 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/30 backdrop-blur-sm transition-all hover:brightness-110 active:scale-95"
      >
        <Sparkles size={12} />
        Recreate
      </button>

      {open && (
        <ModalPortal>
          <RecreateModal ad={ad} onClose={() => setOpen(false)} />
        </ModalPortal>
      )}
    </>
  )
}
