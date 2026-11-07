import 'server-only'
import { q, q1 } from '../db'
import { TZ } from '../dates'

// Consultas del panel del local. SIEMPRE reciben el clientId resuelto por getVenueContext() (sesión → membresía).

export type VenueEventRow = {
  id: string
  title: string
  description: string
  category: string
  status: string
  startsAt: string
  localInput: string // YYYY-MM-DDTHH:MM en hora AR, para <input type="datetime-local">
  dayKey: string
  time: string
  priceLabel: string
  imageUrl: string | null
  neighborhood: string | null
  interested: number
  upcoming: boolean
}

const EVENT_SELECT = `SELECT e.id, e.title, e.description, e.category, e.status, e.starts_at AS "startsAt",
    to_char(e.starts_at AT TIME ZONE '${TZ}', 'YYYY-MM-DD"T"HH24:MI') AS "localInput",
    to_char(e.starts_at AT TIME ZONE '${TZ}', 'YYYY-MM-DD') AS "dayKey",
    to_char(e.starts_at AT TIME ZONE '${TZ}', 'HH24:MI') AS time,
    e.price_label AS "priceLabel", e.image_url AS "imageUrl", e.neighborhood,
    (SELECT count(*)::int FROM event_interest i WHERE i.event_id = e.id) AS interested,
    (e.starts_at >= (date_trunc('day', now() AT TIME ZONE '${TZ}') AT TIME ZONE '${TZ}')) AS upcoming
  FROM event e`

export function listVenueEvents(clientId: string) {
  return q<VenueEventRow>(`${EVENT_SELECT} WHERE e.client_id = $1 ORDER BY e.starts_at DESC`, [clientId])
}

export function getVenueEvent(clientId: string, eventId: string) {
  return q1<VenueEventRow>(`${EVENT_SELECT} WHERE e.client_id = $1 AND e.id = $2`, [clientId, eventId])
}

export async function getVenueMetrics(clientId: string) {
  const row = await q1<{ total: number; published: number; upcoming: number; interested: number }>(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE status = 'published')::int AS published,
            count(*) FILTER (WHERE status = 'published' AND starts_at >= now())::int AS upcoming,
            (SELECT count(*)::int FROM event_interest i JOIN event e2 ON e2.id = i.event_id WHERE e2.client_id = $1) AS interested
       FROM event WHERE client_id = $1`,
    [clientId],
  )
  return row ?? { total: 0, published: 0, upcoming: 0, interested: 0 }
}

export type VenueProfile = {
  id: string
  name: string
  slug: string
  legal_name: string | null
  tax_id: string | null
  city: string | null
  neighborhood: string | null
  address: string | null
  venue_type: string | null
  capacity: number | null
  instagram: string | null
  website: string | null
  phone: string | null
  contact_email: string | null
  description: string | null
  status: string
  plan_id: string | null
  plan_name: string | null
  monthly_price_cents: string
  currency: string
  trial_ends_at: string | null
  billing_day: number | null
  next_due_date: string | null
}

export function getVenueProfile(clientId: string) {
  return q1<VenueProfile>(
    `SELECT c.id, c.name, c.slug, c.legal_name, c.tax_id, c.city, c.neighborhood, c.address, c.venue_type, c.capacity,
            c.instagram, c.website, c.phone, c.contact_email, c.description, c.status, c.plan_id, p.name AS plan_name,
            c.monthly_price_cents::text, c.currency,
            to_char(c.trial_ends_at, 'YYYY-MM-DD') AS trial_ends_at, c.billing_day,
            to_char(c.next_due_date, 'YYYY-MM-DD') AS next_due_date
       FROM client c LEFT JOIN plan p ON p.id = c.plan_id WHERE c.id = $1`,
    [clientId],
  )
}

export function listVenueMembers(clientId: string) {
  return q<{ userId: string; name: string; email: string; role: 'owner' | 'staff'; mustChangePassword: boolean; createdAt: string }>(
    `SELECT u.id AS "userId", u.name, u.email, m.role, u."mustChangePassword", m.created_at AS "createdAt"
       FROM client_member m JOIN "user" u ON u.id = m.user_id
      WHERE m.client_id = $1 ORDER BY m.role, u.name`,
    [clientId],
  )
}

export function listVenuePayments(clientId: string) {
  return q<{ id: string; period: string; amount_cents: string; currency: string; status: string; method: string | null; due_date: string; paid_at: string | null }>(
    `SELECT id, period, amount_cents::text, currency, status, method, to_char(due_date, 'YYYY-MM-DD') AS due_date, paid_at
       FROM payment WHERE client_id = $1 ORDER BY due_date DESC`,
    [clientId],
  )
}
