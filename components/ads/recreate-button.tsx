'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
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
        className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:border-white/40 active:scale-95"
      >
        <RefreshCw size={12} />
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
