export type AccessScope = 'attendee' | 'venue' | 'platform'
export type RoleId =
  | 'visitor'
  | 'attendee'
  | 'owner'
  | 'admin'
  | 'event_manager'
  | 'editor'
  | 'door_staff'
  | 'analyst'
  | 'finance'
  | 'moderator'

export type PermissionId =
  | 'discover_events'
  | 'manage_bookings'
  | 'manage_profile'
  | 'manage_events'
  | 'publish_events'
  | 'view_attendees'
  | 'check_in'
  | 'view_analytics'
  | 'manage_team'
  | 'manage_billing'
  | 'refund_payments'
  | 'moderate_content'
  | 'manage_accounts'

export const accessScopes: { id: AccessScope; label: string; description: string }[] = [
  { id: 'attendee', label: 'Público', description: 'Personas que descubren y asisten a eventos.' },
  { id: 'venue', label: 'Locales', description: 'Propietarios y colaboradores de cada espacio.' },
  { id: 'platform', label: 'Equipo Planb', description: 'Operaciones internas de la plataforma.' },
]

export const permissionGroups: { label: string; permissions: { id: PermissionId; label: string }[] }[] = [
  { label: 'Descubrimiento y cuenta', permissions: [
    { id: 'discover_events', label: 'Explorar eventos y perfiles públicos' },
    { id: 'manage_bookings', label: 'Gestionar reservas y entradas propias' },
  ] },
  { label: 'Espacio y eventos', permissions: [
    { id: 'manage_profile', label: 'Ver y editar el perfil del local' },
    { id: 'manage_events', label: 'Crear y editar eventos' },
    { id: 'publish_events', label: 'Publicar, pausar y cancelar eventos' },
    { id: 'view_attendees', label: 'Ver listas de asistentes y reservas' },
    { id: 'check_in', label: 'Registrar ingreso de asistentes' },
  ] },
  { label: 'Administración', permissions: [
    { id: 'view_analytics', label: 'Ver métricas del espacio' },
    { id: 'manage_team', label: 'Invitar y administrar colaboradores' },
    { id: 'manage_billing', label: 'Administrar plan y facturación' },
    { id: 'refund_payments', label: 'Gestionar cobros y reembolsos' },
  ] },
  { label: 'Operaciones Planb', permissions: [
    { id: 'moderate_content', label: 'Moderar contenido y reportes' },
    { id: 'manage_accounts', label: 'Administrar cuentas y accesos' },
  ] },
]

export const accessRoles: {
  id: RoleId
  name: string
  shortName: string
  scope: AccessScope
  description: string
  permissions: PermissionId[]
  assignable: boolean
}[] = [
  {
    id: 'visitor', name: 'Visitante', shortName: 'Visitante', scope: 'attendee',
    description: 'Explora eventos y locales sin iniciar sesión.',
    permissions: ['discover_events'], assignable: false,
  },
  {
    id: 'attendee', name: 'Asistente', shortName: 'Asistente', scope: 'attendee',
    description: 'Guarda planes y administra sus propias entradas y reservas.',
    permissions: ['discover_events', 'manage_bookings'], assignable: false,
  },
  {
    id: 'owner', name: 'Propietario del local', shortName: 'Propietario', scope: 'venue',
    description: 'Control total del espacio, equipo, plan y facturación.',
    permissions: ['discover_events', 'manage_profile', 'manage_events', 'publish_events', 'view_attendees', 'check_in', 'view_analytics', 'manage_team', 'manage_billing', 'refund_payments'], assignable: false,
  },
  {
    id: 'admin', name: 'Administrador del local', shortName: 'Administrador', scope: 'venue',
    description: 'Administra operaciones, eventos, equipo y métricas del local.',
    permissions: ['discover_events', 'manage_profile', 'manage_events', 'publish_events', 'view_attendees', 'check_in', 'view_analytics', 'manage_team'], assignable: true,
  },
  {
    id: 'event_manager', name: 'Coordinador de eventos', shortName: 'Coordinador', scope: 'venue',
    description: 'Coordina eventos asignados, reservas y listas de asistentes.',
    permissions: ['discover_events', 'manage_events', 'publish_events', 'view_attendees', 'check_in', 'view_analytics'], assignable: true,
  },
  {
    id: 'editor', name: 'Editor de contenido', shortName: 'Editor', scope: 'venue',
    description: 'Prepara eventos y actualiza el contenido del espacio.',
    permissions: ['discover_events', 'manage_profile', 'manage_events'], assignable: true,
  },
  {
    id: 'door_staff', name: 'Personal de acceso', shortName: 'Acceso', scope: 'venue',
    description: 'Consulta listas del evento asignado y registra ingresos.',
    permissions: ['discover_events', 'view_attendees', 'check_in'], assignable: true,
  },
  {
    id: 'analyst', name: 'Analista', shortName: 'Analista', scope: 'venue',
    description: 'Consulta métricas agregadas sin administrar eventos ni equipo.',
    permissions: ['discover_events', 'view_analytics'], assignable: true,
  },
  {
    id: 'finance', name: 'Responsable de finanzas', shortName: 'Finanzas', scope: 'venue',
    description: 'Consulta facturación y gestiona pagos y reembolsos.',
    permissions: ['discover_events', 'manage_billing', 'refund_payments'], assignable: true,
  },
  {
    id: 'moderator', name: 'Moderador Planb', shortName: 'Moderador', scope: 'platform',
    description: 'Revisa reportes y contenido de toda la plataforma.',
    permissions: ['discover_events', 'moderate_content'], assignable: false,
  },
]

export function roleCan(role: RoleId, permission: PermissionId) {
  return accessRoles.find((item) => item.id === role)?.permissions.includes(permission) ?? false
}
