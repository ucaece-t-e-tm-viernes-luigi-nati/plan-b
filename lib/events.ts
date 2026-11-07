// Tipos y catálogos compartidos (servidor y navegador). Los datos reales vienen de la base (lib/data/*).

export const EVENT_CATEGORIES = ['Música', 'Gastronomía', 'Cultura', 'Ferias', 'Talleres'] as const
export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export const eventCategories: Array<'Todo' | EventCategory> = ['Todo', ...EVENT_CATEGORIES]

export const NEIGHBORHOODS = [
  'Güemes',
  'Centro',
  'Playa Grande',
  'Puerto',
  'Constitución',
  'La Perla',
  'Plaza Mitre',
  'Los Troncos',
  'Punta Mogotes',
  'Otro',
] as const

export const ALL_CITY = 'Toda la ciudad'

export const VENUE_TYPES = [
  { id: 'bar', label: 'Bar' },
  { id: 'cafe', label: 'Café' },
  { id: 'centro_cultural', label: 'Centro cultural' },
  { id: 'club', label: 'Club' },
  { id: 'feria', label: 'Feria' },
  { id: 'otro', label: 'Otro' },
] as const

export function venueTypeLabel(id: string | null | undefined) {
  return VENUE_TYPES.find((type) => type.id === id)?.label ?? 'Otro'
}

/** Imágenes de stock incluidas en el proyecto, para elegir al crear un evento. */
export const STOCK_IMAGES = [
  { url: '/images/event-coast.webp', label: 'Costa / música' },
  { url: '/images/event-coffee.webp', label: 'Café / gastronomía' },
  { url: '/images/event-market.webp', label: 'Feria / diseño' },
  { url: '/images/event-theatre.webp', label: 'Teatro / cultura' },
] as const

export const DEFAULT_IMAGE = '/images/event-market.webp'

/** Evento tal como lo ve el público. Fechas ya resueltas en hora de Argentina. */
export type PublicEvent = {
  id: string
  title: string
  description: string
  category: EventCategory
  venue: string
  neighborhood: string
  dayKey: string // YYYY-MM-DD (hora de Argentina)
  time: string // HH:MM
  priceLabel: string
  image: string
  interested: number
  isInterested: boolean
}
