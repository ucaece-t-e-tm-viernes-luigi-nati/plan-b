import { CircleAlert } from 'lucide-react'
import { signOutAction } from '@/app/auth-actions'
import { Brand } from '@/components/planb/brand'
import { NavLinks } from '@/components/panel/nav-links'
import { StatusBadge } from '@/components/panel/ui'
import { requireVenue } from '@/lib/guards'
import { venueCan } from '@/lib/permissions'
import { switchClient } from './actions'

// Guard en el servidor ANTES de responder: sin sesión o sin membresía → 404 (no revela que existe).
export const instant = false

export default async function VenuePanelLayout({ children }: LayoutProps<'/empresa'>) {
  const ctx = await requireVenue('dashboard.view')
  const links = [
    { href: '/empresa', label: 'Resumen' },
    { href: '/empresa/eventos', label: 'Eventos' },
    ...(venueCan(ctx.role, 'venue.edit') ? [{ href: '/empresa/local', label: 'Mi local' }] : []),
    { href: '/empresa/equipo', label: 'Equipo' },
    ...(venueCan(ctx.role, 'billing.view') ? [{ href: '/empresa/plan', label: 'Plan y pagos' }] : []),
  ]

  return (
    <>
      <header className="border-b border-border/70 bg-background/95">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Brand href="/empresa" suffix="locales" />
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {ctx.memberships.length > 1 ? (
              <form action={switchClient} className="flex items-center gap-2">
                <label htmlFor="client-switch" className="sr-only">
                  Cambiar de local
                </label>
                <select id="client-switch" name="clientId" defaultValue={ctx.clientId} className="rounded-lg border border-border bg-card px-2 py-1.5 text-sm">
                  {ctx.memberships.map((m) => (
                    <option key={m.clientId} value={m.clientId}>
                      {m.clientName}
                    </option>
                  ))}
                </select>
                <button className="rounded-lg border border-border px-2 py-1.5 text-xs font-semibold">Cambiar</button>
              </form>
            ) : (
              <span className="font-semibold">{ctx.clientName}</span>
            )}
            <StatusBadge status={ctx.status} />
            <span className="hidden text-muted-foreground sm:inline">{ctx.user.email}</span>
            <form action={signOutAction.bind(null, '/empresa/ingresar')}>
              <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted">Salir</button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-[1240px] px-5 pb-3 sm:px-8">
          <NavLinks links={links} root="/empresa" />
        </div>
      </header>
      {ctx.readOnly && (
        <div role="status" className="border-b border-[#f3c9c9] bg-[#fdeaea] px-5 py-3 text-sm text-[#8f2f2f]">
          <div className="mx-auto flex max-w-[1240px] items-start gap-2 sm:px-3">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>
              Tu cuenta está {ctx.status === 'paused' ? 'pausada' : 'dada de baja'}: el panel queda en modo solo lectura y tus eventos no se muestran al público.
              Para reactivarla, respondé el último mail que te enviamos o escribinos.
            </p>
          </div>
        </div>
      )}
      <main className="mx-auto max-w-[1240px] px-5 pb-16 pt-8 sm:px-8">{children}</main>
    </>
  )
}
