'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      // el usuario canceló: no hacemos nada
    }
  }

  return (
    <button type="button" onClick={share} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold">
      <Share2 className="size-4" aria-hidden="true" />
      <span aria-live="polite">{copied ? 'Link copiado' : 'Compartir'}</span>
    </button>
  )
}
