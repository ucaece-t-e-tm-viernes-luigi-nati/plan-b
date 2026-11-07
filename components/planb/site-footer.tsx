import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Plan B · Agenda de planes locales en Mar del Plata.</p>
        <nav aria-label="Pie de página" className="flex gap-4">
          <Link href="/" className="hover:text-foreground">Descubrir</Link>
          <Link href="/#nosotros" className="hover:text-foreground">Nosotros</Link>
          <Link href="/#planes" className="hover:text-foreground">Para locales</Link>
        </nav>
      </div>
    </footer>
  )
}
