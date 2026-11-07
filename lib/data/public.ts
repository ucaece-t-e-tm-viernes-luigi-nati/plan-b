import 'server-only'
import { q, q1 } from '../db'
import { TZ } from '../dates'
import { DEFAULT_IMAGE, type EventCategory, type PublicEvent } from '../events'
import { hasDatabase } from '../env'

// Solo eventos publicados, de hoy en adelante (hora AR), de locales que no estén pausados ni dados de baja.
const PUBLIC_WHERE = `e.status = 'published'
  AND c.status IN ('trial','active','past_due')
  AND e.starts_at >= (date_trunc('day', now() AT TIME ZONE '${TZ}') AT TIME ZONE '${TZ}')`

const SELECT = `SELECT e.id, e.title, e.description, e.category, c.name AS venue,
       coalesce(e.neighborhood, c.neighborhood, 'Mar del Plata') AS neighborhood,
       to_char(e.starts_at AT TIME ZONE '${TZ}', 'YYYY-MM-DD') AS "dayKey",
       to_char(e.starts_at AT TIME ZONE '${TZ}', 'HH24:MI') AS time,
       e.price_label AS "priceLabel", e.image_url AS image,
       (SELECT count(*)::int FROM event_interest i WHERE i.event_id = e.id) AS interested,
       ($1::text IS NOT NULL AND EXISTS (SELECT 1 FROM event_interest i WHERE i.event_id = e.id AND i.user_id = $1)) AS "isInterested"
  FROM event e JOIN client c ON c.id = e.client_id`

type Row = Omit<PublicEvent, 'image' | 'category'> & { image: string | null; category: string }

function toPublic(row: Row): PublicEvent {
  return { ...row, category: row.category as EventCategory, image: row.image || DEFAULT_IMAGE }
}

export async function getPublicEvents(userId: string | null): Promise<PublicEvent[]> {
  if (!hasDatabase()) return []
  const rows = await q<Row>(`${SELECT} WHERE ${PUBLIC_WHERE} ORDER BY e.starts_at LIMIT 200`, [userId])
  return rows.map(toPublic)
}

export async function getPublicEvent(id: string, userId: string | null): Promise<PublicEvent | null> {
  if (!hasDatabase()) return null
  const row = await q1<Row>(`${SELECT} WHERE ${PUBLIC_WHERE} AND e.id = $2`, [userId, id])
  return row ? toPublic(row) : null
}

export async function getInterestedEvents(userId: string): Promise<PublicEvent[]> {
  const rows = await q<Row>(
    `${SELECT} JOIN event_interest mine ON mine.event_id = e.id AND mine.user_id = $1
      WHERE ${PUBLIC_WHERE} ORDER BY e.starts_at`,
    [userId],
  )
  return rows.map(toPublic)
}

export async function isPublicEvent(id: string) {
  const row = await q1(`SELECT 1 FROM event e JOIN client c ON c.id = e.client_id WHERE ${PUBLIC_WHERE} AND e.id = $1`, [id])
  return !!row
}
