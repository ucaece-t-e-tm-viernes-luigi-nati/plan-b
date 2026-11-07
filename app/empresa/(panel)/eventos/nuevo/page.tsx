import type { Metadata } from 'next'
import Link from 'next/link'
import { EventForm } from '@/components/panel/event-form'
import { Card, PageTitle } from '@/components/panel/ui'
import { getVenueProfile } from '@/lib/data/venue'
import { requireVenue } from '@/lib/guards'
import { createEvent } from '../../actions'

export const metadata: Metadata = { title: 'Nuevo evento' }

export default async function NewEventPage() {
  const ctx = await requireVenue('events.manage')
  const profile = await getVenueProfile(ctx.clientId)
  return (
    <>
      <Link href="/empresa/eventos" className="text-xs font-semibold text-muted-foreground hover:text-primary">
        ← Volver a eventos
      </Link>
      <PageTitle title="Crear evento" description="Podés guardarlo como borrador y publicarlo después." />
      <Card className="max-w-[760px]">
        <EventForm action={createEvent} defaultNeighborhood={profile?.neighborhood} disabled={ctx.readOnly} />
      </Card>
    </>
  )
}
