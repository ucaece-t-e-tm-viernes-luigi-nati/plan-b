export type EventCategory =
  | 'Música'
  | 'Gastronomía'
  | 'Cultura'
  | 'Ferias'
  | 'Talleres'

export type EventItem = {
  id: string
  title: string
  venue: string
  neighborhood: string
  category: EventCategory
  dateLabel: string
  date: string
  time: string
  priceLabel: string
  image: string
  attendees: number
  featured?: boolean
  description: string
}

export const eventCategories: Array<'Todo' | EventCategory> = [
  'Todo',
  'Música',
  'Gastronomía',
  'Cultura',
  'Ferias',
  'Talleres',
]

export const neighborhoods = [
  'Toda la ciudad',
  'Güemes',
  'Centro',
  'Playa Grande',
  'Puerto',
  'Constitución',
]

export const events: EventItem[] = [
  {
    id: 'sunset-sessions',
    title: 'Sunset sessions: música frente al mar',
    venue: 'Club Tri',
    neighborhood: 'Playa Grande',
    category: 'Música',
    dateLabel: 'HOY · 20:30',
    date: '2026-10-23',
    time: '20:30',
    priceLabel: 'Desde $4.500',
    image: '/images/event-coast.png',
    attendees: 128,
    featured: true,
    description:
      'Una tarde larga, bandas locales y el último sol sobre el mar. Vení temprano para disfrutar la terraza.',
  },
  {
    id: 'cafe-de-origen',
    title: 'Café de origen: cata y charla',
    venue: 'Lado B Café',
    neighborhood: 'Güemes',
    category: 'Gastronomía',
    dateLabel: 'SÁB · 10:30',
    date: '2026-10-24',
    time: '10:30',
    priceLabel: 'Entrada gratuita',
    image: '/images/event-coffee.png',
    attendees: 34,
    description:
      'Probá cafés de especialidad de pequeños productores y aprendé a reconocer sus notas.',
  },
  {
    id: 'feria-entremares',
    title: 'Entremares: feria de diseño local',
    venue: 'Casa Mero',
    neighborhood: 'Centro',
    category: 'Ferias',
    dateLabel: 'SÁB · 16:00',
    date: '2026-10-24',
    time: '16:00',
    priceLabel: 'Entrada gratuita',
    image: '/images/event-market.png',
    attendees: 86,
    description:
      'Diseño independiente, cerámica, ilustración y proyectos hechos en Mar del Plata.',
  },
  {
    id: 'impro-a-la-carta',
    title: 'Impro a la carta',
    venue: 'El Galpón de las Artes',
    neighborhood: 'Puerto',
    category: 'Cultura',
    dateLabel: 'SÁB · 21:00',
    date: '2026-10-24',
    time: '21:00',
    priceLabel: 'Desde $6.000',
    image: '/images/event-theatre.png',
    attendees: 57,
    description:
      'Una noche de teatro improvisado donde el público elige qué pasa en escena.',
  },
]
