'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, CircleHelp, Clock3, Eye, MapPin, Plus, Ticket, Users, X } from 'lucide-react'
import { SiteHeader } from '@/components/planb/site-header'

const initialOrganizerEvents = [
  { id: 'a1', name: 'Sunset sessions: música frente al mar', place: 'Club Tri · Playa Grande', date: 'Hoy, 20:30', interested: 128, views: 824, status: 'Publicado' },
  { id: 'a2', name: 'Café de origen: cata y charla', place: 'Lado B Café · Güemes', date: 'Sáb, 10:30', interested: 34, views: 219, status: 'Publicado' },
  { id: 'a3', name: 'Entremares: feria de diseño local', place: 'Casa Mero · Centro', date: 'Sáb, 16:00', interested: 86, views: 491, status: 'Borrador' },
]

type OrganizerEvent = (typeof initialOrganizerEvents)[number]

export function OrganizerDashboard() {
  const [items, setItems] = useState<OrganizerEvent[]>(initialOrganizerEvents)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [published, setPublished] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const place = String(formData.get('place') || '').trim()
    const date = String(formData.get('date') || '')
    const time = String(formData.get('time') || '')
    if (!name || !place || !date || !time) return

    const newEvent: OrganizerEvent = {
      id: crypto.randomUUID(),
      name,
      place,
      date: `${new Date(`${date}T12:00:00`).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}, ${time}`,
      interested: 0,
      views: 0,
      status: 'Borrador',
    }
    setItems((currentItems) => [newEvent, ...currentItems])
    setPublished(true)
    event.currentTarget.reset()
  }

  return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <SiteHeader active="organizer" />
      <main className="mx-auto max-w-[1320px] px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="size-3.5" /> Volver a descubrir</Link>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary"><span className="size-1.5 rounded-full bg-primary" /> Panel de organizador</div>
            <h1 className="mt-2 text-[32px] font-bold tracking-[-0.06em] sm:text-[40px]">Buen día, Lado B <span aria-hidden="true">—</span></h1>
            <p className="mt-1 text-sm text-muted-foreground">Tu próximo evento empieza con una buena convocatoria.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/organizer/team" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"><Users className="size-4 text-primary" /> Equipo y permisos</Link>
            <button type="button" onClick={() => { setIsFormOpen(true); setPublished(false) }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-12px_rgba(89,61,157,0.8)] transition hover:-translate-y-0.5 hover:shadow-lg">
              <Plus className="size-4" /> Crear evento
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#e7dcff] bg-[#f1ebff] px-4 py-3.5 text-sm text-[#5b4589]">
          <CircleHelp className="mt-0.5 size-4 shrink-0" />
          <p><span className="font-semibold">Vista de demostración.</span> Los eventos y las métricas son de ejemplo; crear un evento solo lo agrega a esta sesión.</p>
        </div>

        <section aria-label="Resumen de actividad" className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={<Eye className="size-4" />} label="Vistas de tus eventos" value="1.534" trend="+18%" description="vs. semana pasada" />
          <MetricCard icon={<Users className="size-4" />} label="Personas interesadas" value="248" trend="+32%" description="en todos tus eventos" />
          <MetricCard icon={<Ticket className="size-4" />} label="Entradas reservadas" value="86" trend="+12%" description="para las próximas fechas" />
          <MetricCard icon={<CalendarDays className="size-4" />} label="Eventos este mes" value={String(items.length)} trend="de 5" description="incluidos en tu plan" />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
          <div className="overflow-hidden rounded-[24px] border border-border bg-card">
            <div className="flex flex-col justify-between gap-3 border-b border-border/80 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
              <div>
                <h2 className="text-lg font-bold tracking-[-0.035em]">Tus eventos</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Organizá tus publicaciones y seguí su convocatoria.</p>
              </div>
              <span className="flex w-fit items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground"><span>Este mes</span><ChevronDown className="size-3.5" /></span>
            </div>
            <div className="hidden grid-cols-[minmax(0,1fr)_100px_105px_105px] gap-4 bg-muted/45 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground sm:grid">
              <span>Evento</span><span>Fecha</span><span>Interés</span><span>Estado</span>
            </div>
            <div id="organizer-events" className="divide-y divide-border/80">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_100px_105px_105px] sm:items-center sm:gap-4 sm:px-6">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground"><MapPin className="size-3 shrink-0" /> {item.place}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="size-3.5" /> {item.date}</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-foreground"><Users className="size-3.5 text-muted-foreground" /> {item.interested} personas</span>
                  <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.status === 'Publicado' ? 'bg-[#e7f5ef] text-[#347a5d]' : 'bg-[#fff4d9] text-[#9a6d19]'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => document.getElementById('organizer-events')?.scrollIntoView({ behavior: 'smooth', block: 'end' })} className="flex w-full items-center justify-center gap-2 border-t border-border/80 px-5 py-4 text-sm font-semibold text-primary transition-colors hover:bg-muted/40">Ver todos los eventos <ArrowRight className="size-4" /></button>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[24px] border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-bold">Tu espacio</p><p className="mt-1 text-xs text-muted-foreground">Información del comercio</p></div>
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary">LB</span>
              </div>
              <h3 className="mt-5 text-base font-bold">Lado B Café</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" /> Güemes, Mar del Plata</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs"><span className="text-muted-foreground">Plan mensual</span><span className="font-semibold">Básico · 3/5 eventos</span></div>
              <button type="button" disabled className="mt-4 w-full cursor-not-allowed rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-muted-foreground">Editar espacio · próximamente</button>
            </div>
            <div className="rounded-[24px] bg-[#211639] p-5 text-white">
              <div className="flex items-center gap-2 text-[#c6b4ff]"><SparkleMark /><span className="text-[11px] font-bold uppercase tracking-[0.13em]">Una buena señal</span></div>
              <p className="mt-3 text-[26px] font-bold tracking-[-0.06em]">+32% <span className="text-sm font-medium text-white/65">de interés</span></p>
              <p className="mt-1 text-xs leading-5 text-white/65">Tus eventos generan más interés esta semana. Compartí el link para acercarte a la convocatoria esperada.</p>
              <Link href="/" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#d6cbff]">Abrir agenda pública <ArrowUpRight className="size-3.5" /></Link>
            </div>
          </aside>
        </section>
        <p className="mt-6 text-center text-[11px] text-muted-foreground">Planb para locales · Previsión y métricas ilustrativas en este prototipo.</p>
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#171124]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsFormOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="create-event-title" className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-t-[26px] bg-card shadow-2xl sm:rounded-[26px]">
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Tu próximo plan</p><h2 id="create-event-title" className="mt-1 text-xl font-bold tracking-[-0.04em]">Crear un evento</h2></div>
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex size-9 items-center justify-center rounded-full bg-muted" aria-label="Cerrar formulario"><X className="size-4" /></button>
            </div>
            {published ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#e7f5ef] text-[#347a5d]"><Check className="size-6" /></div>
                <h3 className="mt-4 text-lg font-bold">Listo, ya está en tu panel</h3>
                <p className="mx-auto mt-2 max-w-[330px] text-sm leading-5 text-muted-foreground">El evento quedó como borrador en esta demo. No se publicó ni se guardó en una base de datos.</p>
                <button type="button" onClick={() => setIsFormOpen(false)} className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Volver al panel</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
                <label className="flex flex-col gap-1.5 text-sm font-medium">Nombre del evento<input required name="name" placeholder="Ej. Cata de café de especialidad" className="rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none transition focus:border-primary" /></label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">Lugar y barrio<input required name="place" placeholder="Ej. Lado B Café · Güemes" className="rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none transition focus:border-primary" /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-sm font-medium">Fecha<input required name="date" type="date" className="min-w-0 rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium">Hora<input required name="time" type="time" className="rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary" /></label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-sm font-medium">Categoría<select name="category" className="rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"><option>Música en vivo</option><option>Gastronomía</option><option>Cultura</option><option>Ferias</option><option>Talleres</option></select></label>
                  <label className="flex flex-col gap-1.5 text-sm font-medium">Entradas<select name="ticket" className="rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"><option>Entrada gratuita</option><option>Con entrada</option><option>Reservas</option></select></label>
                </div>
                <div className="mt-1 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold">Cancelar</button>
                  <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="size-4" /> Agregar al demo</button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

function MetricCard({ icon, label, value, trend, description }: { icon: React.ReactNode; label: string; value: string; trend: string; description: string }) {
  return (
    <article className="rounded-[20px] border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-muted-foreground">{label}</span><span className="flex size-8 items-center justify-center rounded-xl bg-primary/8 text-primary">{icon}</span></div>
      <div className="mt-4 flex items-end justify-between gap-2"><p className="text-[29px] font-bold leading-none tracking-[-0.06em]">{value}</p><span className="rounded-full bg-[#e7f5ef] px-2 py-1 text-[10px] font-bold text-[#347a5d]">{trend}</span></div>
      <p className="mt-2 text-[11px] text-muted-foreground">{description}</p>
    </article>
  )
}

function SparkleMark() {
  return <span className="flex size-5 items-center justify-center rounded-md bg-white/10"><ArrowUpRight className="size-3.5" /></span>
}
