import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, type SessionUser } from './auth'
import { q } from './db'
import { superadminEmails } from './env'
import { isReadOnlyStatus, isSuperadmin, venueCan, type VenuePermission, type VenueRole } from './permissions'

export const ACTIVE_CLIENT_COOKIE = 'planb_local'

/** Superadmin o 404 (no revela que la ruta existe). */
export async function requireSuperadmin(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user || !isSuperadmin(user, superadminEmails())) notFound()
  return user
}

export type VenueMembership = {
  clientId: string
  clientName: string
  clientSlug: string
  status: string
  role: VenueRole
}

export const getMemberships = cache(async (userId: string) => {
  return q<VenueMembership>(
    `SELECT c.id AS "clientId", c.name AS "clientName", c.slug AS "clientSlug", c.status, m.role
       FROM client_member m JOIN client c ON c.id = m.client_id
      WHERE m.user_id = $1
      ORDER BY m.created_at`,
    [userId],
  )
})

export type VenueContext = VenueMembership & {
  user: SessionUser
  readOnly: boolean
  memberships: VenueMembership[]
}

/**
 * Contexto del local para el usuario logueado. El client_id SIEMPRE sale de acá
 * (sesión → membresía), nunca del formulario ni de la URL.
 * Sin sesión, sin membresía o sin permiso → 404.
 */
export const getVenueContext = cache(async (): Promise<VenueContext> => {
  const user = await getCurrentUser()
  if (!user) notFound()
  const memberships = await getMemberships(user.id)
  if (!memberships.length) notFound()
  const preferred = (await cookies()).get(ACTIVE_CLIENT_COOKIE)?.value
  const current = memberships.find((m) => m.clientId === preferred) ?? memberships[0]
  return { ...current, user, readOnly: isReadOnlyStatus(current.status), memberships }
})

/** Para páginas del panel: exige permiso y que ya haya cambiado la contraseña temporal. */
export async function requireVenue(permission: VenuePermission = 'dashboard.view') {
  const ctx = await getVenueContext()
  if (ctx.user.mustChangePassword) redirect('/empresa/cambiar-clave')
  if (!venueCan(ctx.role, permission)) notFound()
  return ctx
}

export type ActionState = { ok?: boolean; error?: string; message?: string } | null

/** Para server actions que escriben: además del permiso, bloquea si el local está pausado o dado de baja. */
export async function requireVenueWrite(permission: VenuePermission) {
  const ctx = await requireVenue(permission)
  if (ctx.readOnly) {
    return { ctx, error: 'Tu cuenta está en modo solo lectura (pausada o dada de baja). Escribinos para reactivarla.' }
  }
  return { ctx, error: null as string | null }
}
