import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ActionForm, inputClass, labelClass } from '@/components/forms'
import { Card, PageTitle } from '@/components/panel/ui'
import { getVenueProfile } from '@/lib/data/venue'
import { NEIGHBORHOODS, VENUE_TYPES } from '@/lib/events'
import { requireVenue } from '@/lib/guards'
import { updateVenueProfile } from '../actions'

export const metadata: Metadata = { title: 'Mi local' }

export default async function VenueProfilePage() {
  const ctx = await requireVenue('venue.edit')
  const p = await getVenueProfile(ctx.clientId)
  if (!p) notFound()

  return (
    <>
      <PageTitle eyebrow={ctx.clientName} title="Mi local" description="Estos datos se muestran junto a tus eventos." />
      <Card className="max-w-[760px]">
        <ActionForm action={updateVenueProfile} disabled={ctx.readOnly}>
          <fieldset disabled={ctx.readOnly} className="grid gap-4 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>
              Nombre del local
              <input name="name" required maxLength={80} defaultValue={p.name} className={inputClass} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Descripción corta
              <textarea name="description" rows={3} maxLength={600} defaultValue={p.description ?? ''} className={inputClass} />
            </label>
            <label className={labelClass}>
              Tipo de local
              <select name="venueType" defaultValue={p.venue_type ?? ''} className={inputClass}>
                <option value="">Sin especificar</option>
                {VENUE_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Barrio
              <select name="neighborhood" defaultValue={p.neighborhood ?? ''} className={inputClass}>
                <option value="">Sin especificar</option>
                {NEIGHBORHOODS.map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Dirección
              <input name="address" maxLength={120} defaultValue={p.address ?? ''} className={inputClass} />
            </label>
            <label className={labelClass}>
              Capacidad (personas)
              <input name="capacity" type="number" min={0} max={100000} defaultValue={p.capacity ?? ''} className={inputClass} />
            </label>
            <label className={labelClass}>
              Instagram
              <input name="instagram" maxLength={60} defaultValue={p.instagram ?? ''} placeholder="@tulocal" className={inputClass} />
            </label>
            <label className={labelClass}>
              Web
              <input name="website" maxLength={200} defaultValue={p.website ?? ''} className={inputClass} />
            </label>
            <label className={labelClass}>
              Teléfono / WhatsApp
              <input name="phone" maxLength={40} defaultValue={p.phone ?? ''} className={inputClass} />
            </label>
          </fieldset>
        </ActionForm>
      </Card>
    </>
  )
}
