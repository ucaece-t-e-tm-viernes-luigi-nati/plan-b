// Matriz de permisos de Plan B. ÚNICO lugar donde se define quién puede qué.
// Se chequea SIEMPRE en el servidor (lib/guards.ts), en páginas, server actions y route handlers.

export type PlatformRole = 'superadmin' | 'member'
export type VenueRole = 'owner' | 'staff'

export type VenuePermission =
  | 'dashboard.view' // ver métricas del local
  | 'events.manage' // crear, editar, publicar y borrar eventos
  | 'venue.edit' // editar el perfil del local
  | 'team.view' // ver el equipo
  | 'team.manage' // invitar / quitar miembros
  | 'billing.view' // ver plan y pagos

export const VENUE_PERMISSIONS: Record<VenueRole, readonly VenuePermission[]> = {
  owner: ['dashboard.view', 'events.manage', 'venue.edit', 'team.view', 'team.manage', 'billing.view'],
  staff: ['dashboard.view', 'events.manage', 'team.view'],
}

export const VENUE_ROLE_LABELS: Record<VenueRole, { name: string; description: string }> = {
  owner: { name: 'Propietario', description: 'Control total del local: eventos, perfil, equipo y plan.' },
  staff: { name: 'Staff', description: 'Carga y publica eventos y ve las métricas del local.' },
}

export const PERMISSION_LABELS: Record<VenuePermission, string> = {
  'dashboard.view': 'Ver métricas del local',
  'events.manage': 'Crear, editar y publicar eventos',
  'venue.edit': 'Editar el perfil del local',
  'team.view': 'Ver el equipo',
  'team.manage': 'Invitar y quitar miembros del equipo',
  'billing.view': 'Ver plan y pagos',
}

export function venueCan(role: VenueRole | null | undefined, permission: VenuePermission) {
  return !!role && VENUE_PERMISSIONS[role].includes(permission)
}

/** Estados del cliente en los que el panel queda en solo-lectura y sus eventos se ocultan al público. */
export const READ_ONLY_STATUSES = ['paused', 'cancelled'] as const
export const PUBLIC_VISIBLE_STATUSES = ['trial', 'active', 'past_due'] as const

export function isReadOnlyStatus(status: string) {
  return (READ_ONLY_STATUSES as readonly string[]).includes(status)
}

/** Superadmin: rol en la base + email en SUPERADMIN_EMAILS + email verificado. Las tres cosas. */
export function isSuperadmin(user: { role: string; email: string; emailVerified: boolean } | null, allowedEmails: string[]) {
  return !!user && user.role === 'superadmin' && user.emailVerified && allowedEmails.includes(user.email.toLowerCase())
}
