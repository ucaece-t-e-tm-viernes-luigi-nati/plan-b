'use server'

import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { refresh } from 'next/cache'
import type { FormState } from '@/components/forms'
import { audit } from '@/lib/audit'
import { pool, q, q1, tx } from '@/lib/db'
import { formatDateTime, TZ } from '@/lib/dates'
import { appUrl } from '@/lib/env'
import { EVENT_CATEGORIES, NEIGHBORHOODS, STOCK_IMAGES, VENUE_TYPES } from '@/lib/events'
import { ACTIVE_CLIENT_COOKIE, getVenueContext, requireVenueWrite } from '@/lib/guards'
import { sendMail } from '@/lib/mail'
import { mails } from '@/lib/mail-templates'
import { createCredentialUser, findUserByEmail, generateTempPassword, isValidEmail, normalizeEmail, TEMP_PASSWORD_HOURS } from '@/lib/users'

// Todas las actions resuelven el local desde la sesión (getVenueContext / requireVenueWrite).
// Nunca se acepta un client_id que venga del formulario.

const str = (fd: FormData, key: string, max = 500) => String(fd.get(key) ?? '').trim().slice(0, max)

function parseEvent(fd: FormData) {
  const title = str(fd, 'title', 120)
  const description = str(fd, 'description', 2000)
  const category = str(fd, 'category')
  const startsAt = str(fd, 'startsAt', 20)
  const priceLabel = str(fd, 'priceLabel', 60) || 'Entrada gratuita'
  const neighborhood = str(fd, 'neighborhood', 60)
  const status = str(fd, 'status') === 'published' ? 'published' : 'draft'
  const stock = str(fd, 'imageStock')
  const custom = str(fd, 'imageUrl', 500)

  if (title.length < 3) return { error: 'Poné un título de al menos 3 caracteres.' } as const
  if (!(EVENT_CATEGORIES as readonly string[]).includes(category)) return { error: 'Elegí una categoría.' } as const
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(startsAt)) return { error: 'Indicá fecha y hora del evento.' } as const
  if (neighborhood && !(NEIGHBORHOODS as readonly string[]).includes(neighborhood)) return { error: 'Elegí un barrio de la lista.' } as const
  let imageUrl: string | null = null
  if (custom) {
    if (!/^https:\/\/[^\s"'<>]+$/.test(custom)) return { error: 'La imagen tiene que ser un link https:// válido.' } as const
    imageUrl = custom
  } else if (STOCK_IMAGES.some((img) => img.url === stock)) {
    imageUrl = stock
  }
  return { data: { title, description, category, startsAt, priceLabel, neighborhood: neighborhood || null, status, imageUrl } } as const
}

export async function createEvent(_: FormState, fd: FormData): Promise<FormState> {
  const { ctx, error } = await requireVenueWrite('events.manage')
  if (error) return { error }
  const parsed = parseEvent(fd)
  if ('error' in parsed) return { error: parsed.error }
  const d = parsed.data
  const row = await q1<{ id: string }>(
    `INSERT INTO event (client_id, title, description, category, starts_at, price_label, image_url, neighborhood, status, created_by)
     VALUES ($1, $2, $3, $4, ($5::timestamp AT TIME ZONE '${TZ}'), $6, $7, coalesce($8, (SELECT neighborhood FROM client WHERE id = $1)), $9, $10)
     RETURNING id`,
    [ctx.clientId, d.title, d.description, d.category, d.startsAt, d.priceLabel, d.imageUrl, d.neighborhood, d.status, ctx.user.id],
  )
  await audit({ id: ctx.user.id, role: ctx.role }, 'event.create', { clientId: ctx.clientId, entity: 'event', entityId: row?.id, detail: { status: d.status } })
  redirect('/empresa/eventos')
}

export async function updateEvent(eventId: string, _: FormState, fd: FormData): Promise<FormState> {
  const { ctx, error } = await requireVenueWrite('events.manage')
  if (error) return { error }
  const parsed = parseEvent(fd)
  if ('error' in parsed) return { error: parsed.error }
  const d = parsed.data
  const updated = await q(
    `UPDATE event SET title = $3, description = $4, category = $5, starts_at = ($6::timestamp AT TIME ZONE '${TZ}'),
            price_label = $7, image_url = $8, neighborhood = coalesce($9, neighborhood), status = $10, updated_at = now()
      WHERE id = $2 AND client_id = $1 RETURNING id`,
    [ctx.clientId, eventId, d.title, d.description, d.category, d.startsAt, d.priceLabel, d.imageUrl, d.neighborhood, d.status],
  )
  if (!updated.length) notFound()
  await audit({ id: ctx.user.id, role: ctx.role }, 'event.update', { clientId: ctx.clientId, entity: 'event', entityId: eventId, detail: { status: d.status } })
  redirect('/empresa/eventos')
}

export async function setEventStatus(eventId: string, status: 'draft' | 'published') {
  const { ctx, error } = await requireVenueWrite('events.manage')
  if (error) return
  await q(`UPDATE event SET status = $3, updated_at = now() WHERE id = $2 AND client_id = $1`, [ctx.clientId, eventId, status === 'published' ? 'published' : 'draft'])
  await audit({ id: ctx.user.id, role: ctx.role }, `event.${status === 'published' ? 'publish' : 'unpublish'}`, { clientId: ctx.clientId, entity: 'event', entityId: eventId })
  refresh()
}

export async function deleteEvent(eventId: string) {
  const { ctx, error } = await requireVenueWrite('events.manage')
  if (error) return
  await q(`DELETE FROM event WHERE id = $2 AND client_id = $1`, [ctx.clientId, eventId])
  await audit({ id: ctx.user.id, role: ctx.role }, 'event.delete', { clientId: ctx.clientId, entity: 'event', entityId: eventId })
  redirect('/empresa/eventos')
}

export async function updateVenueProfile(_: FormState, fd: FormData): Promise<FormState> {
  const { ctx, error } = await requireVenueWrite('venue.edit')
  if (error) return { error }
  const name = str(fd, 'name', 80)
  if (name.length < 2) return { error: 'El nombre del local es obligatorio.' }
  const venueType = str(fd, 'venueType')
  const neighborhood = str(fd, 'neighborhood', 60)
  const capacityRaw = str(fd, 'capacity', 6)
  const capacity = capacityRaw ? Number(capacityRaw) : null
  if (capacity !== null && (!Number.isInteger(capacity) || capacity < 0 || capacity > 100000)) return { error: 'La capacidad tiene que ser un número entero.' }
  if (venueType && !VENUE_TYPES.some((t) => t.id === venueType)) return { error: 'Elegí un tipo de local.' }
  if (neighborhood && !(NEIGHBORHOODS as readonly string[]).includes(neighborhood)) return { error: 'Elegí un barrio de la lista.' }

  await q(
    `UPDATE client SET name = $2, description = $3, venue_type = $4, neighborhood = $5, address = $6, capacity = $7,
            instagram = $8, website = $9, phone = $10, updated_at = now()
      WHERE id = $1`,
    [ctx.clientId, name, str(fd, 'description', 600) || null, venueType || null, neighborhood || null, str(fd, 'address', 120) || null, capacity, str(fd, 'instagram', 60) || null, str(fd, 'website', 200) || null, str(fd, 'phone', 40) || null],
  )
  await audit({ id: ctx.user.id, role: ctx.role }, 'client.profile_update', { clientId: ctx.clientId, entity: 'client', entityId: ctx.clientId })
  refresh()
  return { ok: true, message: 'Guardamos los datos del local.' }
}

export async function inviteMember(_: FormState, fd: FormData): Promise<FormState> {
  const { ctx, error } = await requireVenueWrite('team.manage')
  if (error) return { error }
  const email = normalizeEmail(fd.get('email'))
  const name = str(fd, 'name', 80) || email.split('@')[0]
  const role = str(fd, 'role') === 'owner' ? 'owner' : 'staff'
  if (!isValidEmail(email)) return { error: 'Ingresá un correo válido.' }

  const existing = await findUserByEmail(email)
  if (existing) {
    const already = await q1(`SELECT 1 FROM client_member WHERE client_id = $1 AND user_id = $2`, [ctx.clientId, existing.id])
    if (already) return { error: 'Esa persona ya forma parte del equipo.' }
  }

  const password = existing ? null : generateTempPassword()
  const userId = await tx(async (db) => {
    let id = existing?.id
    if (!id && password) {
      id = await createCredentialUser(db, { email, name, password, temporary: true })
    }
    if (!id) throw new Error("usuario inexistente")
    await db.query(`INSERT INTO client_member (client_id, user_id, role) VALUES ($1, $2, $3)`, [ctx.clientId, id, role])
    return id
  })

  const venceClave = formatDateTime(new Date(Date.now() + TEMP_PASSWORD_HOURS * 3600 * 1000))
  await sendMail({
    to: email,
    ...mails.staffAccess({ empresa: ctx.clientName, link: `${appUrl()}/empresa/ingresar`, email, password, venceClave, nuevo: true }),
    secrets: password ? [password] : [],
  })
  await audit({ id: ctx.user.id, role: ctx.role }, 'member.add', { clientId: ctx.clientId, entity: 'user', entityId: userId, detail: { role, newUser: !existing } })
  refresh()
  return { ok: true, message: `Le enviamos un mail a ${email} con el acceso.` }
}

export async function removeMember(userId: string) {
  const { ctx, error } = await requireVenueWrite('team.manage')
  if (error) return
  if (userId === ctx.user.id) return // no se puede quitar a sí mismo
  const owners = await q1<{ n: number }>(`SELECT count(*)::int AS n FROM client_member WHERE client_id = $1 AND role = 'owner' AND user_id <> $2`, [ctx.clientId, userId])
  if (!owners?.n) return // siempre queda al menos un propietario
  await pool.query(`DELETE FROM client_member WHERE client_id = $1 AND user_id = $2`, [ctx.clientId, userId])
  await audit({ id: ctx.user.id, role: ctx.role }, 'member.remove', { clientId: ctx.clientId, entity: 'user', entityId: userId })
  refresh()
}

/** Cambia el local activo (si el usuario pertenece a más de uno). Se valida contra sus membresías. */
export async function switchClient(fd: FormData) {
  const ctx = await getVenueContext()
  const target = String(fd.get('clientId') ?? '')
  if (!ctx.memberships.some((m) => m.clientId === target)) notFound()
  ;(await cookies()).set(ACTIVE_CLIENT_COOKIE, target, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/empresa' })
  redirect('/empresa')
}
