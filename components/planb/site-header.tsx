import { Suspense } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { Brand } from './brand'
import { MobileMenu } from './mobile-menu'

// Header PÚBLICO. Nunca linkea a los paneles internos.
const links = [
  { href: '/', label: 'Descubrir' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#planes', label: 'Para locales' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
        <Brand />

        <div className="hidden items-center gap-1 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground lg:flex">
          <MapPin className="size-4 text-primary" aria-hidden="true" />
          <span>Mar del Plata</span>
        </div>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Navegación principal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Suspense fallback={<LoginLink />}>
            <HeaderUser />
          </Suspense>
        </nav>

        <MobileMenu links={links}>
          <Suspense fallback={<LoginLink />}>
            <HeaderUser />
          </Suspense>
        </MobileMenu>
      </div>
    </header>
  )
}

function LoginLink() {
  return (
    <Link
      href="/ingresar"
      className="ml-1 inline-flex rounded-full bg-primary/8 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/12"
    >
      Ingresar
    </Link>
  )
}

async function HeaderUser() {
  let user = null
  try {
    user = await getCurrentUser()
  } catch {
    user = null
  }
  if (!user) return <LoginLink />
  const initial = user.name.trim().charAt(0).toUpperCase() || 'P'
  return (
    <Link
      href="/mis-planes"
      className="ml-1 inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-semibold"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
        {initial}
      </span>
      Mis planes
    </Link>
  )
}
