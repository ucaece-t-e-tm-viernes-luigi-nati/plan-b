// Datos públicos de la marca. Nada secreto acá: este archivo se usa también en el navegador.
export const site = {
  name: 'Plan B',
  shortName: 'planb',
  city: 'Mar del Plata',
  tagline: 'Descubrí eventos y planes locales en Mar del Plata.',
}

/** CTA de contacto para locales (marketing). Se configura por env; si no hay, queda un placeholder de WhatsApp. */
export function contactHref(subject = 'Quiero sumar mi local a Plan B') {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL
  if (email) return `mailto:${email}?subject=${encodeURIComponent(subject)}`
  const phone = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? '5492230000000'
  return `https://wa.me/${phone}?text=${encodeURIComponent(subject)}`
}
