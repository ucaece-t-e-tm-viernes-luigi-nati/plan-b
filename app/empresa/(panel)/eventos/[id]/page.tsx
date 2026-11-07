import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EventForm } from '@/components/panel/event-form'
import { Card, PageTitle, StatusBadge } from '@/components/panel/ui'
import { getVenueEvent } from '@/lib/data/venue'
import { requireVenue } from '@/lib/guards'
import { deleteEvent, updateEvent } from '../../actions'

export const metadata: Metadata = { title: 'Editar evento' }

export default async function EditEventPage({ params }: PageProps<'/empresa/eventos/[id]'>) {
  const ctx = await requireVenue('events.manage')
  const { id } = await params
  // Filtra por el local de la sesión: un evento de otro local da 404.
  const event = await getVenueEvent(ctx.clientId, id)
  if (!event) notFound()

  return (
    <>
      <Link href="/empresa/eventos" className="text-xs font-semibold text-muted-foreground hover:text-primary">
        ← Volver a eventos
      </Link>
      <PageTitle
        title={event.title}
        description={
          <>
            <StatusBadge status={event.status} /> · {event.interested} personas interesadas
            {event.status === 'published' && event.upcoming && (
              <>
                {' · '}
                <Link href={`/eventos/${event.id}`} className="font-semibold text-primary">
                  Ver en la agenda
                </Link>
              </>
            )}
          </>
        }
      />
      <Card className="max-w-[760px]">
        <EventForm action={updateEvent.bind(null, event.id)} event={event} disabled={ctx.readOnly} />
      </Card>
      {!ctx.readOnly && (
        <form action={deleteEvent.bind(null, event.id)} className="mt-4">
          <button className="rounded-xl border border-destructive/40 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/5">Eliminar evento</button>
        </form>
      )}
    </>
  )
}
