import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { signOutAction } from '@/app/auth-actions'
import { SiteFooter } from '@/components/planb/site-footer'
import { SiteHeader } from '@/components/planb/site-header'
import { getCurrentUser } from '@/lib/auth'
import { getInterestedEvents } from '@/lib/data/public'
import { longDateLabel } from '@/lib/dates'

export const metadata: Metadata = { title: 'Mis planes', robots: { index: false, follow: false } }

export default function MyPlansPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[860px] px-5 pb-16 pt-10 sm:px-8">
        <Suspense fallback={<p className="text-muted-foreground">Cargando…</p>}>
          <MyPlans />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}

async function MyPlans() {
  const user = await getCurrentUser()
  if (!user) redirect('/ingresar?next=/mis-planes')
  const events = await getInterestedEvents(user.id)

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Hola, {user.name}</p>
          <h1 className="mt-1 text-[32px] font-bold tracking-[-0.06em]">Mis planes</h1>
          <p className="text-sm text-muted-foreground">Los próximos eventos que marcaste con &quot;Me interesa&quot;.</p>
        </div>
        <form action={signOutAction.bind(null, '/')}>
          <button className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Cerrar sesión</button>
        </form>
      </div>
      {events.length ? (
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id}>
              <Link href={`/eventos/${event.id}`} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/40">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{event.title}</p>
                  <p className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" aria-hidden="true" /> {longDateLabel(event.dayKey, event.time)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" aria-hidden="true" /> {event.venue} · {event.neighborhood}
                    </span>
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-primary" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className="font-semibold">Todavía no guardaste planes</p>
          <Link href="/" className="mt-3 inline-block text-sm font-semibold text-primary">
            Descubrir planes
          </Link>
        </div>
      )}
    </>
  )
}
