import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Card, Empty, Metric, PageTitle, StatusBadge } from '@/components/panel/ui'
import { getVenueMetrics, listVenueEvents } from '@/lib/data/venue'
import { longDateLabel } from '@/lib/dates'
import { requireVenue } from '@/lib/guards'

export default async function VenueDashboard() {
  const ctx = await requireVenue('dashboard.view')
  const [metrics, events] = await Promise.all([getVenueMetrics(ctx.clientId), listVenueEvents(ctx.clientId)])
  const ranked = [...events].sort((a, b) => b.interested - a.interested).slice(0, 8)
  const max = Math.max(1, ...ranked.map((e) => e.interested))

  return (
    <>
      <PageTitle
        eyebrow="Panel del local"
        title={`Hola, ${ctx.user.name.split(' ')[0]}`}
        description={`Así viene ${ctx.clientName} en Plan B.`}
        actions={
          !ctx.readOnly && (
            <Link href="/empresa/eventos/nuevo" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              <Plus className="size-4" aria-hidden="true" /> Crear evento
            </Link>
          )
        }
      />
      <section aria-label="Métricas" className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Metric label="Eventos cargados" value={metrics.total} />
        <Metric label="Publicados" value={metrics.published} />
        <Metric label="Próximos publicados" value={metrics.upcoming} hint="Visibles hoy en la agenda" />
        <Metric label="Personas interesadas" value={metrics.interested} hint="Suma de &quot;Me interesa&quot; en tus eventos" />
      </section>
      <Card title="Interesados por evento" description="Cuántas personas marcaron &quot;Me interesa&quot; en cada uno.">
        {ranked.length ? (
          <ul className="flex flex-col gap-3">
            {ranked.map((event) => (
              <li key={event.id} className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_auto] sm:items-center sm:gap-4">
                <div className="min-w-0">
                  <Link href={`/empresa/eventos/${event.id}`} className="block truncate text-sm font-semibold hover:text-primary">
                    {event.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {longDateLabel(event.dayKey, event.time)} · <StatusBadge status={event.status} />
                  </p>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(event.interested / max) * 100}%` }} />
                </div>
                <span className="text-sm font-semibold">{event.interested}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>Todavía no cargaste eventos. Creá el primero y publicalo para que aparezca en la agenda.</Empty>
        )}
      </Card>
    </>
  )
}
