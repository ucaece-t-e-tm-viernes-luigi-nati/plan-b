import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Plan B — Encontrá tu próximo plan en Mar del Plata',
    template: '%s | Plan B',
  },
  description:
    'Descubrí eventos y experiencias locales en Mar del Plata: música, gastronomía, cultura, ferias y talleres, por barrio y por fecha.',
  applicationName: 'Plan B',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f8f7fa',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" data-scroll-behavior="smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}
