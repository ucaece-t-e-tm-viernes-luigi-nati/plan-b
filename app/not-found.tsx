import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em]">No encontramos esta página</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">Puede que el link esté mal escrito o que el plan ya no esté disponible.</p>
      <Link href="/" className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
        Ir a descubrir planes
      </Link>
    </main>
  )
}
