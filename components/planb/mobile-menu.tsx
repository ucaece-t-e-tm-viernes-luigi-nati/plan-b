'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function MobileMenu({ links, children }: { links: { href: string; label: string }[]; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        className="flex size-10 items-center justify-center rounded-full border border-border bg-card"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Menú"
          className="absolute inset-x-0 top-[72px] border-b border-border bg-background px-5 py-4 shadow-lg"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a')) setOpen(false)
          }}
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block rounded-xl px-3 py-3 text-base font-semibold hover:bg-muted">
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">{children}</li>
          </ul>
        </nav>
      )}
    </div>
  )
}
