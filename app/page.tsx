import { Suspense } from 'react'
import { connection } from 'next/server'
import { AboutSection } from '@/components/planb/about-section'
import { DiscoveryPage } from '@/components/planb/discovery-page'
import { MerchantPlans } from '@/components/planb/merchant-plans'
import { SiteFooter } from '@/components/planb/site-footer'
import { SiteHeader } from '@/components/planb/site-header'
import { getCurrentUser } from '@/lib/auth'
import { getPublicEvents } from '@/lib/data/public'
import { dayKeyAR } from '@/lib/dates'
import type { PublicEvent } from '@/lib/events'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Suspense fallback={<DiscoverySkeleton />}>
        <Discovery />
      </Suspense>
      <AboutSection />
      <MerchantPlans />
      <SiteFooter />
    </div>
  )
}

// Agenda real desde Neon. Es dinámica (fecha de hoy + sesión), por eso va dentro de <Suspense>.
async function Discovery() {
  await connection()
  let events: PublicEvent[] = []
  let isLoggedIn = false
  let loadError = false
  try {
    const user = await getCurrentUser()
    isLoggedIn = !!user
    events = await getPublicEvents(user?.id ?? null)
  } catch (error) {
    console.error('[home] No se pudo cargar la agenda', error)
    loadError = true
  }
  return <DiscoveryPage events={events} todayKey={dayKeyAR()} isLoggedIn={isLoggedIn} loadError={loadError} />
}

function DiscoverySkeleton() {
  return (
    <main className="mx-auto max-w-[1320px] px-5 pb-16 pt-8 sm:px-8 sm:pt-11" aria-busy="true">
      <div className="mb-8 h-[260px] animate-pulse rounded-[28px] bg-[#211639]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:max-w-[calc(100%-320px)]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[320px] animate-pulse rounded-[22px] bg-muted" />
        ))}
      </div>
      <span className="sr-only">Cargando planes…</span>
    </main>
  )
}
