'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, Check, ChevronDown, Clock3, MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { SiteHeader } from '@/components/planb/site-header'
import { AboutSection } from '@/components/planb/about-section'
import { MerchantPlans } from '@/components/planb/merchant-plans'
import { EventCard } from '@/components/planb/event-card'
import { eventCategories, events, neighborhoods, type EventItem } from '@/lib/events'

const dateFilters = ['Todo', 'Hoy', 'Mañana', 'Este finde'] as const

export function DiscoveryPage() {
  const [category, setCategory] = useState<(typeof eventCategories)[number]>('Todo')
  const [dateFilter, setDateFilter] = useState<(typeof dateFilters)[number]>('Todo')
  const [neighborhood, setNeighborhood] = useState('Toda la ciudad')
  const [query, setQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [markedInterested, setMarkedInterested] = useState(false)

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es-AR')
    return events.filter((event) => {
      const matchesCategory = category === 'Todo' || event.category === category
      const matchesNeighborhood = neighborhood === 'Toda la ciudad' || event.neighborhood === neighborhood
      const matchesQuery = !normalizedQuery || [event.title, event.venue, event.neighborhood, event.category].some((value) => value.toLocaleLowerCase('es-AR').includes(normalizedQuery))
      const matchesDate = dateFilter === 'Todo' || (dateFilter === 'Hoy' && event.date === '2026-10-23') || (dateFilter === 'Mañana' && event.date === '2026-10-24') || (dateFilter === 'Este finde' && ['2026-10-24', '2026-10-25'].includes(event.date))
      return matchesCategory && matchesNeighborhood && matchesQuery && matchesDate
    })
  }, [category, dateFilter, neighborhood, query])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[1320px] px-5 pb-16 pt-8 sm:px-8 sm:pt-11">
        <section className="relative mb-7 overflow-hidden rounded-[28px] bg-[#211639] px-6 py-6 text-white sm:mb-8 sm:px-10 sm:py-9 lg:px-12">
          <div className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full bg-[#8868e8]/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-[28%] size-56 rounded-full bg-[#efb080]/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between sm:gap-7">
            <div className="max-w-[640px]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/80">
                <span className="size-1.5 rounded-full bg-[#a7e1bc]" /> Mar del Plata · una ciudad, mil planes
              </div>
              <h1 className="max-w-[590px] text-[36px] font-semibold leading-[1.04] tracking-[-0.06em] sm:text-[54px]">
                Tu próximo plan <span className="text-[#c6b4ff]">está acá.</span>
              </h1>
              <p className="mt-2 max-w-[450px] text-sm leading-5 text-white/70 sm:mt-3 sm:text-base sm:leading-6">
                Descubrí qué pasa cerca tuyo. Planes para hoy, para el finde y para compartir.
              </p>
            </div>
            <div className="flex w-full max-w-[430px] items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-sm">
              <Search className="ml-2 size-5 shrink-0 text-white/60" aria-hidden="true" />
              <label htmlFor="event-search" className="sr-only">Buscar eventos, lugares o zonas</label>
              <input
                id="event-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="¿Qué te gustaría hacer?"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/55"
              />
              <button type="button" onClick={() => document.getElementById('event-search')?.focus()} className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#211639] transition-transform hover:scale-105" aria-label="Enfocar búsqueda">
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
          <div className="relative z-10 mt-6 hidden flex-wrap items-center gap-2 text-xs font-medium text-white/75 sm:flex">
            <span className="mr-1 flex items-center gap-1.5"><Sparkles className="size-3.5 text-[#c6b4ff]" /> Lo que se mueve</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">Música en vivo</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">Cafés de especialidad</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">Diseño local</span>
          </div>
        </section>

        <section aria-labelledby="events-heading" className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-10">
          <div className="min-w-0">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  <span className="size-1.5 rounded-full bg-primary" /> Hecho para salir
                </div>
                <h2 id="events-heading" className="text-[27px] font-bold tracking-[-0.055em] sm:text-[32px]">Planes para vos</h2>
                <p className="mt-1 text-sm text-muted-foreground">Ideas reales, cerca tuyo y para compartir.</p>
              </div>
              <button type="button" onClick={() => setNeighborhood('Toda la ciudad')} aria-label="Mostrar eventos de toda la ciudad" className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                <MapPin className="size-4 text-primary" /> {neighborhood} <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
            </div>

            <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1" aria-label="Filtrar por fecha">
              {dateFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setDateFilter(filter)}
                  aria-pressed={dateFilter === filter}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${dateFilter === filter ? 'bg-foreground text-background' : 'border border-border bg-card text-muted-foreground hover:text-foreground'}`}
                >
                  {filter === 'Hoy' && <Clock3 className="mr-1.5 inline size-3.5" />}
                  {filter === 'Mañana' && <CalendarDays className="mr-1.5 inline size-3.5" />}
                  {filter}
                </button>
              ))}
              <span className="mx-1 h-6 w-px shrink-0 bg-border" />
              <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {eventCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium transition-colors ${category === item ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{filteredEvents.length} planes</span> para descubrir</p>
              <span className="text-xs text-muted-foreground">Actualizado hoy</span>
            </div>
            {filteredEvents.length ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {filteredEvents.map((event) => <EventCard key={event.id} event={event} onSelect={(selected) => { setSelectedEvent(selected); setMarkedInterested(false) }} />)}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
                <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-muted"><Search className="size-5 text-muted-foreground" /></div>
                <h3 className="font-semibold">No encontramos planes con esos filtros</h3>
                <p className="mt-1 text-sm text-muted-foreground">Probá con otra zona, fecha o categoría.</p>
                <button type="button" onClick={() => { setCategory('Todo'); setDateFilter('Todo'); setNeighborhood('Toda la ciudad'); setQuery('') }} className="mt-4 text-sm font-semibold text-primary">Limpiar filtros</button>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4 xl:pt-[2px]" aria-label="Descubrimiento por zona">
            <div className="rounded-[24px] border border-border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Explorá por zona</p>
                  <p className="mt-1 text-xs text-muted-foreground">Elegí el barrio y encontrá tu plan.</p>
                </div>
                <MapPin className="size-4 text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                {neighborhoods.map((place, index) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => setNeighborhood(place)}
                    aria-pressed={neighborhood === place}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${neighborhood === place ? 'bg-primary/8 font-semibold text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                  >
                    <span className="flex items-center gap-2"><span className={`size-1.5 rounded-full ${index === 0 ? 'bg-primary' : 'bg-border'}`} />{place}</span>
                    {neighborhood === place && <Check className="size-4" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-[24px] bg-[#eae4fb] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#7257b9]">Para los que hacen</p>
                  <h3 className="mt-2 max-w-[195px] text-[21px] font-bold leading-tight tracking-[-0.04em] text-[#24183b]">¿Tenés un evento para compartir?</h3>
                </div>
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/70 text-[#7257b9]"><ArrowRight className="size-4" /></span>
              </div>
              <p className="mt-2 text-sm leading-5 text-[#52456f]">Llegá a más personas y organizá mejor cada fecha.</p>
              <a href="/organizer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#5e43a5]">Conocé Planb para locales <ArrowRight className="size-4" /></a>
            </div>
            <p className="px-1 text-[11px] leading-5 text-muted-foreground">Prototipo de Planb · eventos y cifras ilustrativos, no representan una agenda en vivo.</p>
          </aside>
        </section>
      </main>

      <AboutSection />
      <MerchantPlans />

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#171124]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedEvent(null) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="event-detail-title" className="relative w-full max-w-[520px] overflow-hidden rounded-t-[26px] bg-card shadow-2xl sm:rounded-[26px]">
            <div className="relative aspect-[2/1]">
              <Image src={selectedEvent.image} alt="" width={1000} height={500} sizes="(max-width: 520px) 100vw, 520px" className="size-full object-cover" />
              <button type="button" onClick={() => setSelectedEvent(null)} aria-label="Cerrar detalle" className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/90"><X className="size-4" /></button>
            </div>
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{selectedEvent.category} · {selectedEvent.dateLabel}</span>
              <h2 id="event-detail-title" className="mt-2 text-2xl font-bold tracking-[-0.05em]">{selectedEvent.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{selectedEvent.description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1.5"><MapPin className="size-4" /> {selectedEvent.venue} · {selectedEvent.neighborhood}</span><span>{selectedEvent.priceLabel}</span></div>
              <button type="button" onClick={() => setMarkedInterested((value) => !value)} aria-pressed={markedInterested} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">{markedInterested ? 'Ya te interesa' : 'Me interesa'} {markedInterested ? <Check className="size-4" /> : <ArrowRight className="size-4" />}</button>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">En esta demo, la reserva todavía no está habilitada.</p>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
