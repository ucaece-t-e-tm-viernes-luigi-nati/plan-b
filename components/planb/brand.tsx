import Link from 'next/link'

export function Brand({ href = '/', suffix }: { href?: string; suffix?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5" aria-label="Plan B, ir al inicio">
      <span className="flex size-9 items-center justify-center rounded-[13px] bg-primary text-primary-foreground">
        <span className="text-[18px] font-black tracking-[-0.08em]">p.</span>
      </span>
      <span className="text-[22px] font-extrabold tracking-[-0.07em]">planb</span>
      {suffix && (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] text-primary">{suffix}</span>
      )}
    </Link>
  )
}
