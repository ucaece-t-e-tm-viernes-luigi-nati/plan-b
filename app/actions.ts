'use server'

import { getCurrentUser } from '@/lib/auth'
import { q, q1 } from '@/lib/db'
import { isPublicEvent } from '@/lib/data/public'

export type InterestResult = { needsLogin: true } | { needsLogin: false; interested: boolean; count: number } | { error: string }

/** "Me interesa": requiere sesión. Marca o desmarca el interés del usuario logueado. */
export async function toggleInterest(eventId: string): Promise<InterestResult> {
  const user = await getCurrentUser()
  if (!user) return { needsLogin: true }
  if (typeof eventId !== 'string' || !eventId || !(await isPublicEvent(eventId))) return { error: 'Este evento ya no está disponible.' }

  const removed = await q(`DELETE FROM event_interest WHERE event_id = $1 AND user_id = $2 RETURNING 1`, [eventId, user.id])
  if (!removed.length) {
    await q(`INSERT INTO event_interest (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [eventId, user.id])
  }
  const row = await q1<{ count: number }>(`SELECT count(*)::int AS count FROM event_interest WHERE event_id = $1`, [eventId])
  return { needsLogin: false, interested: !removed.length, count: row?.count ?? 0 }
}
