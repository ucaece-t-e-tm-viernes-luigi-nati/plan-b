import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Card, Empty, PageTitle, StatusBadge, Table, Td } from '@/components/panel/ui'
import { listVenueEvents } from '@/lib/data/venue'
import { longDateLabel } from '@/lib/dates'
import { requireVenue } from '@/lib/guards'
import { setEventStatus } from '../actions'

export const metadata: Metadata = { title: 'Eventos' }

export default async function VenueEventsPage() {
  const ctx = await requireVenue('events.manage')
  const events = await listVenueEvents(ctx.clientId)

  return (
    <>
      <PageTitle
        eyebrow={ctx.clientName}
        title="Eventos"
        description="Los publicados y próximos aparecen en la agenda pública."
        actions={
          !ctx.readOnly && (
            <Link href="/empresa/eventos/nuevo" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              <Plus className="size-4" aria-hidden="true" /> Crear evento
            </Link>
          )
        }
      />
      <Card>
        {events.length ? (
          <Table head={['Evento', 'Fecha', 'Interesados', 'Estado', '']}>
            {events.map((event) => (
              <tr key={event.id} className={event.upcoming ? '' : 'opacity-60'}>
                <Td>
                  <Link href={`/empresa/eventos/${event.id}`} className="font-semibold hover:text-primary">
                    {event.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {event.category} · {event.neighborhood ?? 'Barrio del local'}
                    {!event.upcoming && ' · ya pasó'}
                  </p>
                </Td>
                <Td className="text-xs text-muted-foreground">{longDateLabel(event.dayKey, event.time)}</Td>
                <Td>{event.interested}</Td>
                <Td>
                  <StatusBadge status={event.status} />
                </Td>
                <Td className="text-right">
                  {!ctx.readOnly && (
                    <form action={setEventStatus.bind(null, event.id, event.status === 'published' ? 'draft' : 'published')}>
                      <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">
                        {event.status === 'published' ? 'Pasar a borrador' : 'Publicar'}
                      </button>
                    </form>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        ) : (
          <Empty>Todavía no hay eventos.</Empty>
        )}
      </Card>
    </>
  )
}
