'use client'

import { PasswordInput } from '@/components/password-input'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth-client'
import { inputClass, labelClass } from '@/components/forms'

function safeNext(value: string | null) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}

/** Login / registro del PÚBLICO (personas que guardan planes). No da acceso a ningún panel. */
export function PublicLoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = safeNext(params.get('next'))
  const [register, setRegister] = useState(params.get('modo') === 'registro')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    const result = register
      ? await signUp.email({ name: String(form.get('name')).trim(), email, password })
      : await signIn.email({ email, password })
    setLoading(false)
    if (result.error) {
      setError(register ? 'No pudimos crear la cuenta. ¿Ya existe ese correo?' : 'Correo o contraseña incorrectos.')
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 rounded-[24px] border border-border bg-card p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.04em]">{register ? 'Creá tu cuenta' : 'Ingresá'}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Guardá los planes que te interesan y encontralos rápido.</p>
      </div>
      {register && (
        <label className={labelClass}>
          Nombre
          <input name="name" required autoComplete="name" maxLength={80} className={inputClass} />
        </label>
      )}
      <label className={labelClass}>
        Correo electrónico
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className={labelClass}>
        Contraseña
        <PasswordInput
          name="password"
          required
          minLength={8}
          autoComplete={register ? 'new-password' : 'current-password'}
          className={inputClass}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <button disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
        {loading ? 'Un momento…' : register ? 'Crear cuenta' : 'Ingresar'}
      </button>
      <button type="button" onClick={() => setRegister(!register)} className="text-sm text-muted-foreground underline">
        {register ? 'Ya tengo cuenta' : 'No tengo cuenta, quiero registrarme'}
      </button>
      <Link href="/" className="text-center text-xs text-muted-foreground hover:text-foreground">
        Volver a la agenda
      </Link>
    </form>
  )
}
