'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Bookmark, Check } from 'lucide-react'
import { toggleInterest } from '@/app/actions'

type Props = {
  eventId: string
  title: string
  interested: boolean
  count: number
  isLoggedIn: boolean
  variant?: 'icon' | 'full'
  onChange?: (state: { interested: boolean; count: number }) => void
}

/** Botón "Me interesa" real: guarda en event_interest. Sin sesión, lleva a /ingresar y vuelve al evento. */
export function InterestButton({ eventId, title, interested, count, isLoggedIn, variant = 'icon', onChange }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function onClick() {
    if (!isLoggedIn) {
      router.push(`/ingresar?next=${encodeURIComponent(`/eventos/${eventId}`)}`)
      return
    }
    setError('')
    startTransition(async () => {
      const result = await toggleInterest(eventId)
      if ('error' in result) setError(result.error)
      else if (result.needsLogin) router.push(`/ingresar?next=${encodeURIComponent(`/eventos/${eventId}`)}`)
      else onChange?.({ interested: result.interested, count: result.count })
    })
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-label={interested ? `Quitar "${title}" de mis planes` : `Me interesa "${title}"`}
        aria-pressed={interested}
        title={error || undefined}
        className={`flex size-9 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors disabled:opacity-60 ${interested ? 'bg-primary text-primary-foreground' : 'bg-background/90 text-foreground hover:bg-background'}`}
      >
        <Bookmark className={`size-4 ${interested ? 'fill-current' : ''}`} aria-hidden="true" />
      </button>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={interested}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-70"
      >
        {interested ? 'Ya te interesa' : 'Me interesa'}
        {interested ? <Check className="size-4" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
      </button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground" aria-live="polite">
        {error ||
          (isLoggedIn
            ? `${count} ${count === 1 ? 'persona interesada' : 'personas interesadas'}`
            : `${count} ${count === 1 ? 'persona interesada' : 'personas interesadas'} · Ingresá para guardarlo en tus planes`)}
      </p>
    </div>
  )
}

/** Versión con estado propio (para la página del evento). */
export function InterestToggle(props: Omit<Props, 'onChange'>) {
  const [state, setState] = useState({ interested: props.interested, count: props.count })
  return <InterestButton {...props} interested={state.interested} count={state.count} onChange={setState} />
}
