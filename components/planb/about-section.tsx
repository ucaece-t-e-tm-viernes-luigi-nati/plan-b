'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Accessibility, ArrowDown, ArrowRight, HeartHandshake, Lightbulb, MapPin, MoveUpRight, Sparkles, Users } from 'lucide-react'

const values = [
  { icon: HeartHandshake, title: 'Conexión', description: 'Acercamos organizadores y personas para que cada evento encuentre a su público.' },
  { icon: Lightbulb, title: 'Innovación', description: 'Simplificamos la búsqueda de planes y la gestión de eventos.' },
  { icon: Accessibility, title: 'Accesibilidad', description: 'Hacemos que descubrir nuevas experiencias sea fácil para todos.' },
  { icon: MoveUpRight, title: 'Compromiso', description: 'Impulsamos el crecimiento de los organizadores locales.' },
  { icon: Users, title: 'Comunidad', description: 'Promovemos la cultura, el entretenimiento y las experiencias compartidas.' },
]

export function AboutSection() {
  return (
    <section id="nosotros" aria-labelledby="about-heading" className="scroll-mt-24 border-t border-border/70 bg-[#f8f7fa]">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:mb-10">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.17em] text-primary"><Sparkles className="size-3.5" /> La historia detrás de Planb</span>
            <h2 id="about-heading" className="mt-2 text-[34px] font-bold tracking-[-0.06em] sm:text-[44px]">Nosotros</h2>
          </div>
          <a href="#events-heading" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/35 hover:text-primary"><ArrowDown className="size-4" /> Volver a los eventos</a>
        </div>

        <div className="grid overflow-hidden rounded-[30px] bg-[#211639] text-white lg:grid-cols-[1.04fr_0.96fr]">
          <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-white/80"><MapPin className="size-3.5 text-[#c6b4ff]" /> Nacimos en Mar del Plata</span>
            <h3 className="max-w-[560px] text-[34px] font-semibold leading-[1.05] tracking-[-0.06em] sm:text-[48px]">Una ciudad llena de experiencias <span className="text-[#c6b4ff]">por descubrir.</span></h3>
            <p className="mt-5 max-w-[530px] text-sm leading-7 text-white/75 sm:text-base">Creemos que siempre hay algo nuevo por descubrir. Por eso, creamos una plataforma que reúne los mejores eventos en un solo lugar, conectando a las personas con experiencias únicas y ayudando a los organizadores a llegar a su público ideal.</p>
            <p className="mt-4 max-w-[530px] text-sm leading-7 text-white/75 sm:text-base">Queremos hacer que encontrar qué hacer sea más fácil, accesible y conectado.</p>
            <Link href="/organizer" className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#211639] transition hover:bg-[#f1ebff]">Conocé Planb para locales <ArrowRight className="size-4" /></Link>
          </div>
          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-full">
            <Image src="/images/event-market.png" alt="Personas recorren una feria de diseño local y comparten experiencias" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#211639]/55 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
              <p className="max-w-[260px] text-sm font-medium leading-5 text-white drop-shadow sm:text-base">Un solo lugar para encontrar eso que te hace salir.</p>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-sm"><MoveUpRight className="size-4" /></span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <article className="rounded-[24px] border border-border bg-card p-6 sm:p-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Para qué existimos</span>
            <h3 className="mt-2 text-[22px] font-bold tracking-[-0.045em] sm:text-[26px]">Nuestra misión</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">Conectar a las personas con experiencias y eventos que les interesen, brindando a los organizadores una plataforma para promocionarse, anticipar su convocatoria y gestionar mejor sus eventos.</p>
          </article>
          <article className="rounded-[24px] border border-[#e7dcff] bg-[#f1ebff] p-6 sm:p-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7257b9]">Hacia dónde vamos</span>
            <h3 className="mt-2 text-[22px] font-bold tracking-[-0.045em] text-[#24183b] sm:text-[26px]">Nuestra visión</h3>
            <p className="mt-3 text-sm leading-7 text-[#52456f]">Ser la plataforma líder en descubrimiento y promoción de eventos, comenzando en Mar del Plata y expandiéndonos a nuevas ciudades, transformando la forma de conectar personas y experiencias.</p>
          </article>
        </div>

        <div className="mt-14 sm:mt-20">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Lo que nos guía</span><h3 className="mt-2 text-[28px] font-bold tracking-[-0.055em] sm:text-[34px]">Nuestros valores</h3></div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">La manera en que conectamos a la ciudad con sus próximos planes.</p>
          </div>
          <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 xl:grid-cols-5">
            {values.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="rounded-[20px] border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/30">
                <span className={`flex size-10 items-center justify-center rounded-xl ${index % 2 === 0 ? 'bg-[#f1ebff] text-primary' : 'bg-[#f7f0e8] text-[#9a6743]'}`}><Icon className="size-[18px]" aria-hidden="true" /></span>
                <h4 className="mt-4 text-base font-bold tracking-[-0.025em]">{title}</h4>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 rounded-[24px] border border-border bg-card px-6 py-5 sm:flex-row sm:items-center sm:px-8">
          <div><p className="text-sm font-bold">¿Listo para descubrir tu próximo plan?</p><p className="mt-1 text-xs text-muted-foreground">La ciudad tiene algo nuevo esperándote.</p></div>
          <Link href="/#events-heading" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Explorar eventos <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  )
}
