'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ArrowUpRight, Bookmark, MapPin, Users } from 'lucide-react'
import type { EventItem } from '@/lib/events'

const categoryStyles: Record<EventItem['category'], string> = {
  Música: 'bg-[#f0eaff] text-[#6746c8]',
  Gastronomía: 'bg-[#fff0e7] text-[#b65b2a]',
  Cultura: 'bg-[#e9f1ff] text-[#3d67b5]',
  Ferias: 'bg-[#e7f5ef] text-[#347a5d]',
  Talleres: 'bg-[#fff4d9] text-[#9a6d19]',
}

export function EventCard({ event, onSelect }: { event: EventItem; onSelect: (event: EventItem) => void }) {
  const [saved, setSaved] = useState(false)

  return (
    <article className="group min-w-0 overflow-hidden rounded-[22px] border border-border/80 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_42px_-28px_rgba(35,27,55,0.35)]">
      <div className="relative aspect-[1.58/1] overflow-hidden bg-muted">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 430px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <span className="rounded-full bg-background/90 px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] text-foreground shadow-sm backdrop-blur-sm">
            {event.dateLabel}
          </span>
          <button
            type="button"
            onClick={() => setSaved((value) => !value)}
            aria-label={saved ? `Quitar ${event.title} de guardados` : `Guardar ${event.title}`}
            aria-pressed={saved}
            className={`flex size-9 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors ${saved ? 'bg-primary text-primary-foreground' : 'bg-background/90 text-foreground hover:bg-background'}`}
          >
            <Bookmark className={`size-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${categoryStyles[event.category]}`}>
            {event.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3.5" aria-hidden="true" /> {event.attendees} interesados
          </span>
        </div>
        <button type="button" onClick={() => onSelect(event)} className="block w-full text-left">
          <h3 className="line-clamp-2 text-[17px] font-bold leading-snug tracking-[-0.035em] text-foreground transition-colors group-hover:text-primary sm:text-[18px]">
            {event.title}
          </h3>
        </button>
        <div className="mt-2.5 flex items-center justify-between gap-2 text-sm">
          <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{event.venue} · {event.neighborhood}</span>
          </div>
          <span className="shrink-0 font-semibold text-foreground">{event.priceLabel}</span>
        </div>
        <button
          type="button"
          onClick={() => onSelect(event)}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2"
        >
          Ver evento <ArrowUpRight className="size-4" />
        </button>
      </div>
    </article>
  )
}
