import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Brand } from '@/components/planb/brand'
import { PublicLoginForm } from './login-form'

export const metadata: Metadata = { title: 'Ingresar', robots: { index: false, follow: false } }

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Brand />
        </div>
        <Suspense>
          <PublicLoginForm />
        </Suspense>
      </div>
    </main>
  )
}
