import type { Metadata } from 'next'

// Superficie de LOCALES (clientes B2B). No se linkea desde la parte pública; no se indexa.
export const metadata: Metadata = {
  title: { default: 'Panel del local', template: '%s · Panel del local | Plan B' },
  robots: { index: false, follow: false, nocache: true },
}

export default function EmpresaLayout({ children }: LayoutProps<'/empresa'>) {
  return <div className="min-h-screen bg-[#f8f7fa]">{children}</div>
}
