import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'

export function SiteHeader({ active = 'discover' }: { active?: 'discover' | 'organizer' }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Planb, ir al inicio">
          <span className="flex size-9 items-center justify-center rounded-[13px] bg-primary text-primary-foreground">
            <span className="text-[18px] font-black tracking-[-0.08em]">p.</span>
          </span>
          <span className="text-[22px] font-extrabold tracking-[-0.07em]">planb</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground md:flex">
          <MapPin className="size-4 text-primary" />
          <span>Mar del Plata</span>
          <span className="mx-1 text-border">/</span>
          <span className="text-foreground">Güemes</span>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Navegación principal">
          <Link
            href="/"
            className={`hidden rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:inline-flex ${active === 'discover' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Descubrir
          </Link>
          <Link
            href="/#nosotros"
            className="hidden rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            Nosotros
          </Link>
          <Link
            href="/#planes"
            className="inline-flex rounded-full px-2 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:px-3 sm:text-sm"
          >
            Planes
          </Link>
          <Link
            href="/organizer"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active === 'organizer' ? 'bg-primary text-primary-foreground' : 'bg-primary/8 text-primary hover:bg-primary/12'}`}
          >
            Para locales
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
          <span className="hidden size-10 items-center justify-center rounded-full border border-border bg-card text-sm font-semibold sm:flex" aria-label="Perfil de usuario">
            M
          </span>
        </nav>
      </div>
    </header>
  )
}
