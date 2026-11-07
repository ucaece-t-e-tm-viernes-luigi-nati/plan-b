'use client'

import { useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, ChevronDown, CircleHelp, Crown, Eye, FilePenLine, LockKeyhole, Mail, MapPin, Plus, Search, ShieldCheck, TicketCheck, Trash2, UserRound, Users, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SiteHeader } from '@/components/planb/site-header'
import { accessRoles, accessScopes, permissionGroups, type AccessScope, type RoleId } from '@/lib/planb-access'

type TeamRole = Extract<RoleId, 'owner' | 'admin' | 'event_manager' | 'editor' | 'door_staff' | 'analyst' | 'finance'>
type TeamMember = { id: number; name: string; email: string; role: TeamRole; initials: string; status: 'active' | 'pending' }
type Section = 'team' | 'roles'

const roleIcons: Record<RoleId, LucideIcon> = {
  visitor: Eye,
  attendee: TicketCheck,
  owner: Crown,
  admin: ShieldCheck,
  event_manager: MapPin,
  editor: FilePenLine,
  door_staff: Users,
  analyst: Search,
  finance: LockKeyhole,
  moderator: ShieldCheck,
}

const initialMembers: TeamMember[] = [
  { id: 1, name: 'Marina López', email: 'marina@ladob.cafe', role: 'owner', initials: 'ML', status: 'active' },
  { id: 2, name: 'Tomás Ríos', email: 'tomas@ladob.cafe', role: 'admin', initials: 'TR', status: 'active' },
  { id: 3, name: 'Sol Fernández', email: 'sol@ladob.cafe', role: 'editor', initials: 'SF', status: 'active' },
  { id: 4, name: 'Agustín Díaz', email: 'agustin@ladob.cafe', role: 'door_staff', initials: 'AD', status: 'pending' },
]

const venueRoles = accessRoles.filter((role) => role.scope === 'venue')
const assignableRoles = venueRoles.filter((role) => role.assignable)

function initialsFor(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('') || 'PL'
}

export function TeamPermissions() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers)
  const [section, setSection] = useState<Section>('team')
  const [scope, setScope] = useState<AccessScope>('venue')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  const visibleMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return members.filter((member) => !normalized || `${member.name} ${member.email}`.toLowerCase().includes(normalized))
  }, [members, query])
  const scopedRoles = accessRoles.filter((role) => role.scope === scope)
  const activeMembers = members.filter((member) => member.status === 'active').length
  const pendingMembers = members.filter((member) => member.status === 'pending').length

  function showNotice(message: string) {
    setNotice(message)
    setError('')
    window.setTimeout(() => setNotice(''), 4000)
  }

  function inviteMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '').trim().toLowerCase()
    const roleValue = String(form.get('role') || '')
    const role = assignableRoles.find((item) => item.id === roleValue)
    if (!role) {
      setError('Elegí un rol disponible para el equipo del local.')
      return
    }
    if (members.some((member) => member.email === email)) {
      setError('Ese correo ya forma parte del equipo o tiene una invitación pendiente.')
      return
    }
    const name = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
    setMembers((current) => [...current, { id: Date.now(), name, email, role: role.id as TeamRole, initials: initialsFor(name), status: 'pending' }])
    setInviteOpen(false)
    event.currentTarget.reset()
    showNotice(`Invitación de demostración creada para ${email}.`)
  }

  function changeRole(id: number, value: string) {
    const role = assignableRoles.find((item) => item.id === value)
    if (!role) return
    setMembers((current) => current.map((member) => member.id === id && member.role !== 'owner' ? { ...member, role: role.id as TeamRole } : member))
    showNotice('Rol actualizado en esta sesión.')
  }

  function removeMember(id: number) {
    const member = members.find((item) => item.id === id)
    if (!member || member.role === 'owner') return
    setMembers((current) => current.filter((item) => item.id !== id))
    showNotice(`${member.name} ya no aparece en el equipo de demostración.`)
  }

  return (
    <div className="min-h-screen bg-[#f8f7fa]">
      <SiteHeader active="organizer" />
      <main className="mx-auto max-w-[1240px] px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <Link href="/organizer" className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="size-3.5" /> Volver al panel</Link>
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary"><Users className="size-3.5" /> Planb · acceso y equipo</div>
            <h1 className="mt-2 text-[32px] font-bold tracking-[-0.06em] sm:text-[40px]">Roles y permisos</h1>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">Organizá el acceso a Planb: desde quienes descubren eventos hasta el equipo que administra cada local.</p>
          </div>
          {section === 'team' && <button type="button" onClick={() => { setInviteOpen(true); setError('') }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-12px_rgba(89,61,157,0.8)] transition hover:-translate-y-0.5"><Plus className="size-4" /> Invitar al equipo</button>}
        </div>

        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#e7dcff] bg-[#f1ebff] px-4 py-3.5 text-sm text-[#5b4589]">
          <CircleHelp className="mt-0.5 size-4 shrink-0" />
          <p><span className="font-semibold">Prototipo funcional.</span> Invitaciones y cambios son de muestra y solo duran esta sesión. Para aplicar permisos reales se necesita iniciar sesión y validar cada acción en el servidor.</p>
        </div>
        {notice && <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-[#d3ecdf] bg-[#eef8f2] px-4 py-3 text-sm font-medium text-[#347a5d]"><Check className="size-4" /> {notice}</div>}
        {error && <div role="alert" className="mb-5 rounded-xl border border-[#f1d3d0] bg-[#fff4f2] px-4 py-3 text-sm font-medium text-[#9d4239]">{error}</div>}

        <div className="mb-6 flex gap-1 rounded-2xl border border-border bg-card p-1.5" role="group" aria-label="Secciones de acceso">
          <button type="button" aria-pressed={section === 'team'} onClick={() => setSection('team')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${section === 'team' ? 'bg-[#211639] text-white shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}><Users className="size-4" /> Equipo del local <span className="hidden rounded-full bg-white/15 px-2 py-0.5 text-[10px] sm:inline">{members.length}</span></button>
          <button type="button" aria-pressed={section === 'roles'} onClick={() => setSection('roles')} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${section === 'roles' ? 'bg-[#211639] text-white shadow-sm' : 'text-muted-foreground hover:bg-muted'}`}><ShieldCheck className="size-4" /> Roles y matriz</button>
        </div>

        {section === 'team' ? (
          <>
            <section aria-label="Resumen del equipo" className="mb-5 grid gap-3 sm:grid-cols-3">
              <SummaryCard icon={Users} label="Integrantes" value={String(members.length)} detail="en este espacio" />
              <SummaryCard icon={Check} label="Accesos activos" value={String(activeMembers)} detail="con acceso al local" />
              <SummaryCard icon={Mail} label="Invitaciones" value={String(pendingMembers)} detail="pendientes de aceptar" />
            </section>
            <section aria-label="Integrantes del equipo" className="overflow-hidden rounded-[24px] border border-border bg-card">
              <div className="flex flex-col justify-between gap-3 border-b border-border/80 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
                <div><h2 className="text-lg font-bold tracking-[-0.035em]">Integrantes del espacio</h2><p className="mt-0.5 text-xs text-muted-foreground">Asigná el nivel de acceso adecuado para cada tarea.</p></div>
                <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground focus-within:border-primary"><Search className="size-4" /><span className="sr-only">Buscar integrantes</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar integrante" className="w-full bg-transparent text-sm text-foreground outline-none sm:w-40" /></label>
              </div>
              <div className="hidden grid-cols-[minmax(0,1fr)_190px_110px_44px] gap-4 bg-muted/45 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground sm:grid"><span>Persona</span><span>Rol</span><span>Estado</span><span className="sr-only">Acciones</span></div>
              {visibleMembers.length ? <div className="divide-y divide-border/80">{visibleMembers.map((member) => {
                const role = accessRoles.find((item) => item.id === member.role)!
                const RoleIcon = roleIcons[member.role]
                return <div key={member.id} className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_190px_110px_44px] sm:items-center sm:gap-4 sm:px-6">
                  <div className="flex min-w-0 items-center gap-3"><span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${member.role === 'owner' ? 'bg-[#fff4d9] text-[#8a6419]' : 'bg-[#f1ebff] text-primary'}`}>{member.initials}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{member.name}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{member.email}</p></div></div>
                  {member.role === 'owner' ? <span className="flex w-fit items-center gap-1.5 rounded-lg bg-[#fff4d9] px-3 py-2 text-xs font-semibold text-[#8a6419]"><Crown className="size-3.5" /> Propietario</span> : <label className="relative flex w-fit items-center"><span className="sr-only">Rol de {member.name}</span><select value={member.role} onChange={(event) => changeRole(member.id, event.target.value)} className="appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-9 text-xs font-semibold outline-none focus:border-primary">{assignableRoles.map((item) => <option key={item.id} value={item.id}>{item.shortName}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 size-3.5 text-muted-foreground" /></label>}
                  <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${member.status === 'active' ? 'bg-[#e7f5ef] text-[#347a5d]' : 'bg-[#fff4d9] text-[#8a6419]'}`}>{member.status === 'active' ? 'Activo' : 'Pendiente'}</span>
                  {member.role === 'owner' ? <span className="hidden sm:block" /> : <button type="button" onClick={() => removeMember(member.id)} aria-label={`Quitar a ${member.name}`} className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-[#fff0ef] hover:text-[#ae433a]"><Trash2 className="size-4" /></button>}
                  <p className="text-xs leading-5 text-muted-foreground sm:hidden"><RoleIcon className="mr-1 inline size-3.5" />{role.description}</p>
                </div>
              })}</div> : <div className="px-6 py-10 text-center"><p className="text-sm font-semibold">No encontramos integrantes</p><p className="mt-1 text-xs text-muted-foreground">Probá con otro nombre o correo.</p></div>}
              <div className="flex flex-col gap-2 border-t border-border/80 bg-muted/25 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><p className="text-xs leading-5 text-muted-foreground">El propietario no se puede quitar ni cambiar de rol desde esta pantalla.</p><button type="button" onClick={() => setSection('roles')} className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-primary">Consultar permisos <ShieldCheck className="size-3.5" /></button></div>
            </section>
          </>
        ) : (
          <section aria-label="Roles y matriz de permisos" className="space-y-5">
            <div className="rounded-[24px] border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-lg font-bold tracking-[-0.035em]">Roles de Planb</h2><p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">Tres ámbitos distintos: asistentes, equipos de los locales y operaciones internas de Planb.</p></div><div className="flex flex-wrap gap-2" aria-label="Filtrar ámbito de roles">{accessScopes.map((item) => <button key={item.id} type="button" onClick={() => setScope(item.id)} aria-pressed={scope === item.id} className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${scope === item.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{item.label}</button>)}</div></div>
              <p className="mt-3 text-xs text-muted-foreground">{accessScopes.find((item) => item.id === scope)?.description}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{scopedRoles.map((role) => {
                const Icon = roleIcons[role.id]
                return <article key={role.id} className="rounded-2xl border border-border/80 bg-background p-4"><div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1ebff] text-primary"><Icon className="size-4" /></span><div className="min-w-0"><h3 className="text-sm font-bold">{role.name}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{role.description}</p></div></div><p className="mt-3 border-t border-border/70 pt-3 text-[11px] font-semibold text-primary">{role.permissions.length} permisos incluidos</p></article>
              })}</div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-border bg-card">
              <div className="border-b border-border/80 px-5 py-5 sm:px-6"><h2 className="text-lg font-bold tracking-[-0.035em]">Matriz de permisos</h2><p className="mt-1 text-xs text-muted-foreground">Compará las acciones disponibles para cada rol de {accessScopes.find((item) => item.id === scope)?.label.toLowerCase()}.</p></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left text-xs">
                  <thead><tr className="bg-muted/45"><th scope="col" className="sticky left-0 z-10 min-w-[230px] bg-muted/90 px-5 py-3 font-bold text-muted-foreground backdrop-blur">Permiso</th>{scopedRoles.map((role) => <th scope="col" key={role.id} className="min-w-[112px] px-3 py-3 text-center font-bold text-foreground">{role.shortName}</th>)}</tr></thead>
                  {permissionGroups.map((group) => {
                    const relevantPermissions = group.permissions.filter((permission) => scopedRoles.some((role) => role.permissions.includes(permission.id)))
                    if (!relevantPermissions.length) return null
                    return <tbody key={group.label}><tr><th colSpan={scopedRoles.length + 1} className="border-t border-border/80 bg-background px-5 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-primary">{group.label}</th></tr>{relevantPermissions.map((permission) => <tr key={permission.id} className="border-t border-border/60"><th scope="row" className="sticky left-0 z-[1] bg-card px-5 py-3.5 text-left font-medium text-foreground">{permission.label}</th>{scopedRoles.map((role) => <td key={role.id} className="px-3 py-3.5 text-center">{role.permissions.includes(permission.id) ? <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#e7f5ef] text-[#347a5d]" aria-label={`${role.name}: permitido`}><Check className="size-3.5" /></span> : <span className="text-muted-foreground/45" aria-label={`${role.name}: sin permiso`}>—</span>}</td>)}</tr>)}</tbody>
                  })}
                </table>
              </div>
              <p className="border-t border-border/80 bg-muted/25 px-5 py-3 text-[11px] text-muted-foreground sm:px-6">La matriz describe el alcance previsto; todavía no aplica restricciones reales en la app.</p>
            </div>
          </section>
        )}
        <p className="mt-6 text-center text-[11px] text-muted-foreground">Planb · Los accesos y datos de equipo son ilustrativos en esta versión.</p>
      </main>

      {inviteOpen && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#171124]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setInviteOpen(false) }}>
        <section role="dialog" aria-modal="true" aria-labelledby="invite-title" className="w-full max-w-[480px] rounded-t-[26px] bg-card shadow-2xl sm:rounded-[26px]">
          <div className="flex items-start justify-between border-b border-border px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Equipo de Lado B Café</p><h2 id="invite-title" className="mt-1 text-xl font-bold tracking-[-0.04em]">Invitar integrante</h2></div><button type="button" onClick={() => setInviteOpen(false)} className="flex size-9 items-center justify-center rounded-full bg-muted" aria-label="Cerrar invitación"><X className="size-4" /></button></div>
          <form onSubmit={inviteMember} className="flex flex-col gap-4 px-6 py-5">
            <label className="flex flex-col gap-1.5 text-sm font-medium">Correo electrónico<span className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 focus-within:border-primary"><Mail className="size-4 text-muted-foreground" /><input required type="email" name="email" placeholder="nombre@ejemplo.com" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" /></span></label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">Rol<select name="role" defaultValue="editor" className="rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:border-primary">{assignableRoles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>
            <p className="text-xs leading-5 text-muted-foreground">La invitación queda pendiente en el prototipo. No se envía un correo ni se crea una cuenta.</p>
            <div className="mt-1 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end"><button type="button" onClick={() => setInviteOpen(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold">Cancelar</button><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="size-4" /> Crear invitación demo</button></div>
          </form>
        </section>
      </div>}
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string; detail: string }) {
  return <article className="rounded-[20px] border border-border bg-card p-4 sm:p-5"><div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-muted-foreground">{label}</span><span className="flex size-8 items-center justify-center rounded-xl bg-primary/8 text-primary"><Icon className="size-4" /></span></div><div className="mt-3 flex items-end gap-2"><p className="text-[29px] font-bold leading-none tracking-[-0.06em]">{value}</p><p className="pb-0.5 text-[11px] text-muted-foreground">{detail}</p></div></article>
}
