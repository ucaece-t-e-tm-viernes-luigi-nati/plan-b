import { ActionForm, inputClass, labelClass, type FormState } from '@/components/forms'
import { EVENT_CATEGORIES, NEIGHBORHOODS, STOCK_IMAGES } from '@/lib/events'
import type { VenueEventRow } from '@/lib/data/venue'

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>
  event?: VenueEventRow | null
  defaultNeighborhood?: string | null
  disabled?: boolean
}

export function EventForm({ action, event, defaultNeighborhood, disabled }: Props) {
  const isStock = !event?.imageUrl || STOCK_IMAGES.some((img) => img.url === event.imageUrl)
  return (
    <ActionForm action={action} submitLabel={event ? 'Guardar cambios' : 'Crear evento'} disabled={disabled}>
      <fieldset disabled={disabled} className="flex flex-col gap-4">
        <label className={labelClass}>
          Título del evento
          <input name="title" required minLength={3} maxLength={120} defaultValue={event?.title} placeholder="Ej. Cata de café de especialidad" className={inputClass} />
        </label>
        <label className={labelClass}>
          Descripción
          <textarea name="description" rows={4} maxLength={2000} defaultValue={event?.description} className={inputClass} placeholder="Contá de qué se trata, qué incluye, si hay que reservar…" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Categoría
            <select name="category" required defaultValue={event?.category ?? ''} className={inputClass}>
              <option value="" disabled>
                Elegí una
              </option>
              {EVENT_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Fecha y hora (hora de Argentina)
            <input name="startsAt" type="datetime-local" required defaultValue={event?.localInput} className={inputClass} />
          </label>
          <label className={labelClass}>
            Precio
            <input name="priceLabel" maxLength={60} defaultValue={event?.priceLabel ?? 'Entrada gratuita'} placeholder="Entrada gratuita / Desde $5.000" className={inputClass} />
          </label>
          <label className={labelClass}>
            Barrio
            <select name="neighborhood" defaultValue={event?.neighborhood ?? defaultNeighborhood ?? ''} className={inputClass}>
              <option value="">El del local</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Imagen
            <select name="imageStock" defaultValue={isStock ? (event?.imageUrl ?? STOCK_IMAGES[0].url) : ''} className={inputClass}>
              {STOCK_IMAGES.map((img) => (
                <option key={img.url} value={img.url}>
                  {img.label}
                </option>
              ))}
              <option value="">Usar link propio (abajo)</option>
            </select>
          </label>
          <label className={labelClass}>
            Link de imagen propia (opcional, https://)
            <input name="imageUrl" type="url" maxLength={500} defaultValue={isStock ? '' : (event?.imageUrl ?? '')} placeholder="https://…" className={inputClass} />
          </label>
        </div>
        <fieldset className="flex flex-wrap gap-4 text-sm">
          <legend className="mb-2 text-sm font-medium">Estado</legend>
          <label className="flex items-center gap-2">
            <input type="radio" name="status" value="draft" defaultChecked={event?.status !== 'published'} /> Borrador (no se ve en la agenda)
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="status" value="published" defaultChecked={event?.status === 'published'} /> Publicado
          </label>
        </fieldset>
      </fieldset>
    </ActionForm>
  )
}
