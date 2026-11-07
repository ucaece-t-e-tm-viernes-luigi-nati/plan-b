// Fechas en hora de Argentina. Funciones puras: sirven en servidor y navegador.
export const TZ = 'America/Argentina/Buenos_Aires'

/** YYYY-MM-DD de una fecha en hora de Argentina. */
export function dayKeyAR(date: Date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

function parseKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

function toKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function addDays(key: string, days: number) {
  const date = parseKey(key)
  date.setUTCDate(date.getUTCDate() + days)
  return toKey(date)
}

/** 0 = domingo … 6 = sábado */
export function weekday(key: string) {
  return parseKey(key).getUTCDay()
}

/** Días del "finde" relevante: sábado y domingo de esta semana (si hoy es domingo, solo hoy). */
export function weekendKeys(todayKey: string) {
  const dow = weekday(todayKey)
  if (dow === 0) return [todayKey]
  const saturday = addDays(todayKey, 6 - dow)
  return [saturday, addDays(saturday, 1)]
}

const WEEKDAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

/** Etiqueta corta para la tarjeta: "HOY · 20:30", "MAÑANA · 10:30", "SÁB 15/11 · 16:00". */
export function shortDateLabel(dayKey: string, time: string, todayKey: string) {
  if (dayKey === todayKey) return `HOY · ${time}`
  if (dayKey === addDays(todayKey, 1)) return `MAÑANA · ${time}`
  const [, m, d] = dayKey.split('-')
  return `${WEEKDAYS[weekday(dayKey)]} ${d}/${m} · ${time}`
}

/** "sábado 15 de noviembre, 20:30 h" */
export function longDateLabel(dayKey: string, time: string) {
  const text = new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }).format(parseKey(dayKey))
  return `${text}, ${time} h`
}

/** DD/MM/AAAA para un Date, un string ISO o 'YYYY-MM-DD'. */
export function formatDate(value: Date | string | null | undefined) {
  if (!value) return '—'
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-')
    return `${d}/${m}/${y}`
  }
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('es-AR', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: TZ,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/** "USD 29" / "USD 29,50" */
export function formatMoney(cents: number | string | null | undefined, currency = 'USD') {
  const value = Number(cents ?? 0) / 100
  const text = new Intl.NumberFormat('es-AR', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(value)
  return `${currency} ${text}`
}

/** Próxima fecha de vencimiento: el día de pago del mes siguiente al vencimiento anterior. */
export function nextDueAfter(previousDueKey: string, billingDay: number) {
  const [y, m] = previousDueKey.split('-').map(Number)
  const date = new Date(Date.UTC(y, m, Math.min(Math.max(billingDay, 1), 28)))
  return toKey(date)
}
