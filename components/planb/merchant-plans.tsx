import { contactHref } from '@/lib/site'
import { ArrowRight, BadgeCheck, ChartNoAxesCombined, Megaphone, Sparkles, Ticket, UsersRound } from 'lucide-react'

const plans = [
  {
    name: 'Inicial',
    price: '15',
    description: 'Para empezar a compartir lo que pasa en tu espacio.',
    features: ['Publicaciones básicas', 'Gestión de experiencias', 'Soporte por email'],
    featured: false,
  },
  {
    name: 'Pro',
    price: '29',
    description: 'Para llegar a más personas y entender qué les interesa.',
    features: ['Publicaciones destacadas', 'Analytics básico', 'Soporte prioritario'],
    featured: true,
  },
  {
    name: 'Premium',
    price: '59',
    description: 'Para crecer con máxima visibilidad y acompañamiento.',
    features: ['Máxima visibilidad', 'Analytics avanzado', 'Soporte dedicado'],
    featured: false,
  },
]

const revenueStreams = [
  { icon: Megaphone, title: 'Publicaciones individuales', description: 'Más visibilidad para un evento puntual.' },
  { icon: Ticket, title: 'Comisiones futuras', description: 'Posibles ingresos por venta de entradas.' },
  { icon: UsersRound, title: 'Patrocinios estratégicos', description: 'Marcas que potencian experiencias locales.' },
]

export function MerchantPlans() {
  return (
    <section id="planes" aria-labelledby="merchant-plans-heading" className="scroll-mt-24 border-t border-border/70 bg-white">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e5dcfa] bg-[#f3efff] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6948b9]"><Sparkles className="size-3.5" /> Para comercios y organizadores</span>
          <h2 id="merchant-plans-heading" className="mt-4 text-[34px] font-bold leading-tight tracking-[-0.06em] text-[#211639] sm:text-[48px]">Planes para hacer crecer tu espacio</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Elegí cómo querés promocionar tus eventos. Descubrir planes en Planb sigue siendo gratis para las personas.</p>
        </div>

        <div className="grid items-stretch gap-4 md:grid-cols-3 md:gap-3 lg:gap-5">
          {plans.map((plan) => (
            <article key={plan.name} className={`relative flex flex-col overflow-hidden rounded-[26px] border p-5 sm:p-6 ${plan.featured ? 'border-[#39206f] bg-[#211639] text-white shadow-[0_22px_60px_-32px_rgba(42,25,84,0.75)] md:-translate-y-2' : 'border-border bg-[#fcfbfd] text-[#211639]'}`}>
              {plan.featured && <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#cbbaff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#29194c]"><BadgeCheck className="size-3.5" /> Más elegido</div>}
              {!plan.featured && <div className="mb-5 h-[26px]" aria-hidden="true" />}
              <h3 className="text-xl font-bold capitalize tracking-[-0.04em]">{plan.name}</h3>
              <p className={`mt-2 min-h-10 text-xs leading-5 ${plan.featured ? 'text-white/65' : 'text-muted-foreground'}`}>{plan.description}</p>
              <div className={`mt-5 flex items-end gap-1 border-b pb-5 ${plan.featured ? 'border-white/15' : 'border-border'}`}>
                <span className={`mb-1 text-[11px] font-bold uppercase tracking-[0.1em] ${plan.featured ? 'text-white/60' : 'text-muted-foreground'}`}>USD</span>
                <span className="text-[54px] font-semibold leading-none tracking-[-0.07em]">${plan.price}</span>
                <span className={`mb-1 text-sm ${plan.featured ? 'text-white/65' : 'text-muted-foreground'}`}>/ mes</span>
              </div>
              <ul className="mt-2 flex flex-1 flex-col gap-0" aria-label={`Incluye el plan ${plan.name}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className={`flex items-start gap-2.5 border-b py-3.5 text-sm ${plan.featured ? 'border-white/10 text-white/85' : 'border-border/80 text-[#382d4d]'}`}>
                    <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${plan.featured ? 'bg-white/15 text-[#d9ccff]' : 'bg-[#eee8fb] text-[#6948b9]'}`}><BadgeCheck className="size-3.5" aria-hidden="true" /></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a href={contactHref(`Quiero sumar mi local a Plan B (plan ${plan.name})`)} target="_blank" rel="noopener noreferrer" className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${plan.featured ? 'bg-white text-[#211639] hover:bg-[#eee8fb]' : 'border border-border bg-white text-[#211639] hover:border-[#b9a5e9] hover:bg-[#f7f4fc]'}`}>
                Quiero sumar mi local <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-[24px] bg-[#211639] text-white">
          <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {revenueStreams.map(({ icon: Icon, title, description }) => (
              <article key={title} className="flex items-start gap-4 px-5 py-5 sm:flex-col sm:gap-3 sm:px-6 sm:py-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#cbbaff]"><Icon className="size-[18px]" aria-hidden="true" /></span>
                <div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/65">{description}</p></div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#e4d9fb] bg-[#f5f1fd] px-4 py-3.5 sm:items-center sm:px-5">
          <ChartNoAxesCombined className="mt-0.5 size-4 shrink-0 text-[#6948b9] sm:mt-0" aria-hidden="true" />
          <p className="text-xs leading-5 text-[#51426f]"><strong className="font-semibold text-[#2c1d50]">Cómo sumarte:</strong> escribinos y te enviamos por mail un link personal para dar de alta tu local. Todos los planes incluyen 14 días de prueba gratis; los precios son en dólares por mes. Descubrir planes sigue siendo gratis para el público.</p>
        </div>
      </div>
    </section>
  )
}
