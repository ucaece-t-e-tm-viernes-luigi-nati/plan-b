import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { ArrowLeft, CalendarDays, MapPin, Ticket } from 'lucide-react'
import { categoryStyles } from '@/components/planb/event-card'
import { InterestToggle } from '@/components/planb/interest-button'
import { ShareButton } from '@/components/planb/share-button'
import { SiteFooter } from '@/components/planb/site-footer'
import { SiteHeader } from '@/components/planb/site-header'
import { getCurrentUser } from '@/lib/auth'
import { getPublicEvent } from '@/lib/data/public'
import { longDateLabel } from '@/lib/dates'

export async function generateMetadata({ params }: PageProps<'/eventos/[id]'>): Promise<Metadata> {
  const { id } = await params
  try {
    const event = await getPublicEvent(id, null)
    if (event) return { title: event.title, description: `${event.venue} · ${event.neighborhood}. ${event.description}`.slice(0, 160) }
  } catch {
    // sin base: metadata por defecto
  }
  return { title: 'Evento' }
}

export default function EventPage({ params }: PageProps<'/eventos/[id]'>) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[980px] px-5 pb-16 pt-8 sm:px-8">
        <Link href="/" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" aria-hidden="true" /> Volver a la agenda
        </Link>
        <Suspense fallback={<div className="h-[480px] animate-pulse rounded-[28px] bg-muted" aria-busy="true" />}>
          <EventDetail params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}

async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params
  const user = await getCurrentUser().catch(() => null)
  const event = await getPublicEvent(id, user?.id ?? null)
  if (!event) notFound()

  return (
    <article className="overflow-hidden rounded-[28px] border border-border bg-card">
      <div className="relative aspect-[2/1] bg-muted">
        <Image src={event.image} alt="" fill priority unoptimized={!event.image.startsWith('/')} sizes="(max-width: 980px) 100vw, 980px" className="object-cover" />
      </div>
      <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${categoryStyles[event.category]}`}>{event.category}</span>
          <h1 className="mt-3 text-[30px] font-bold leading-tight tracking-[-0.05em] sm:text-[40px]">{event.title}</h1>
          <p className="mt-4 whitespace-pre-line text-base leading-7 text-muted-foreground">{event.description}</p>
        </div>
        <aside className="flex flex-col gap-4">
          <ul className="flex flex-col gap-3 rounded-2xl bg-muted/60 p-4 text-sm">
            <li className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="first-letter:uppercase">{longDateLabel(event.dayKey, event.time)}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {event.venue} · {event.neighborhood}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Ticket className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{event.priceLabel}</span>
            </li>
          </ul>
          <InterestToggle variant="full" eventId={event.id} title={event.title} interested={event.isInterested} count={event.interested} isLoggedIn={!!user} />
          <ShareButton title={event.title} />
        </aside>
      </div>
    </article>
  )
}
