import { PasswordInput } from '@/components/password-input'
import type { Metadata } from 'next'
import { ActionForm, inputClass, labelClass } from '@/components/forms'
import { Brand } from '@/components/planb/brand'
import { venueSignIn } from '../auth-actions'

export const metadata: Metadata = { title: 'Ingresar' }

// Login propio de los locales. Se llega por el link del mail de aprobación.
export default function VenueLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Brand suffix="locales" />
        </div>
        <div className="mt-6 rounded-[24px] border border-border bg-card p-6">
          <h1 className="text-2xl font-bold tracking-[-0.04em]">Panel de tu local</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ingresá con el usuario que te enviamos por mail.</p>
          <ActionForm action={venueSignIn} submitLabel="Ingresar" pendingLabel="Ingresando…" className="mt-5 flex flex-col gap-4" submitClassName="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            <label className={labelClass}>
              Correo electrónico
              <input name="email" type="email" required autoComplete="email" className={inputClass} />
            </label>
            <label className={labelClass}>
              Contraseña
              <PasswordInput name="password" required autoComplete="current-password" className={inputClass} />
            </label>
          </ActionForm>
        </div>
      </div>
    </main>
  )
}
