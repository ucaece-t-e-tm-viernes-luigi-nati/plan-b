import type { Metadata } from 'next'

// Superficie del EQUIPO de Plan B (superadmin). Sin links desde la parte pública; no se indexa.
export const metadata: Metadata = {
  title: { default: 'Plataforma', template: '%s · Plataforma | Plan B' },
  robots: { index: false, follow: false, nocache: true },
}

export default function PlataformaLayout({ children }: LayoutProps<'/plataforma'>) {
  return <div className="min-h-screen bg-[#f6f5f9]">{children}</div>
}
