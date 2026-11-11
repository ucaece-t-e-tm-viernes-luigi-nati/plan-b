# Plan B

**Plan B** es una agenda de descubrimiento de planes y eventos locales en **Mar del Plata**: música, gastronomía, cultura, ferias y talleres, filtrables por barrio y por fecha.

MVP del Taller Emprendedor — Universidad CAECE, Mar del Plata (comisión viernes, 2.º cuatrimestre 2026).

- **App publicada:** https://planb-lat.vercel.app
- **Landing del curso:** https://ucaece-t-e-tm-viernes-luigi-nati.github.io/landing/

## Modelo (B2B2C)

| Quién | Qué hace | Paga |
|---|---|---|
| **Público** | Descubre planes, marca "Me interesa" y los guarda en "Mis planes". | No, es gratis. |
| **Locales y organizadores** (clientes) | Publican sus eventos y ven cuánta gente se interesa. | Abono mensual (planes Inicial / Pro / Premium, en USD, con 14 días de prueba). |
| **Equipo de Plan B** | Da de alta locales, aprueba solicitudes, registra pagos. | — |

## Superficies

Las tres superficies **nunca se muestran juntas** y cada una tiene su propio login:

- **Pública** — `/` (agenda), `/eventos/[id]` (página compartible de cada evento), `/ingresar` (cuenta del público) y `/mis-planes`.
- **Panel de locales** — una sección interna a la que los locales llegan con el link que reciben por mail al ser aprobados. Incluye métricas reales, gestión de eventos, perfil del local, equipo (propietario / staff) y plan y pagos.
- **Plataforma (equipo)** — sección interna del equipo: solicitudes, locales, invitaciones, planes, registro de mails y auditoría.

Las secciones internas no están linkeadas desde la parte pública, no se indexan (`robots.txt`, `noindex`) y responden **404** a quien no tenga sesión con el rol correspondiente. Todos los permisos se verifican en el servidor (`proxy.ts` como primera barrera, y `lib/permissions.ts` + `lib/guards.ts` en cada página, layout y server action) y los datos de cada local se filtran siempre por el local de la sesión.

### Alta de locales

Los locales **no se registran solos**: el equipo genera una invitación personal (un solo uso, 14 días) o un link de campaña, y el local completa un formulario de 5 pasos (cuenta, datos, características del local, plan, revisión) que se guarda como borrador. Al enviarlo queda **pendiente de revisión**; el equipo lo aprueba (se crea el usuario con contraseña temporal de 72 h y se fijan plan, abono, fin de prueba y día de pago), pide correcciones o lo rechaza. Cada paso dispara su mail y todos quedan registrados en `email_outbox`.

### Cobros

Los pagos se registran a mano desde la plataforma. Un cron diario (`vercel.json` → `/api/cron/vencimientos`, protegido con `CRON_SECRET`) avisa 5 días antes del vencimiento, pasa a "pago vencido" al vencer y pausa la cuenta a los `PAUSE_AFTER_DAYS` días. Un local pausado o dado de baja queda con el panel en solo lectura y sus eventos dejan de verse en la agenda.

## Stack

Next.js 16 (App Router, `cacheComponents`) · React 19 · Tailwind CSS 4 · better-auth (email + contraseña) · Neon Postgres (`pg` + drizzle para el esquema tipado) · nodemailer · Vercel.

## Tablas

`user`, `session`, `account`, `verification` (better-auth) · `plan` · `client` · `client_member` · `client_invite` · `client_application` · `payment` · `email_outbox` · `audit_log` · `event` · `event_interest`.

Las crea `scripts/migrate.mjs`, que es idempotente y corre automáticamente antes de cada build.

## Variables de entorno

Ver `.env.example` (con comentarios). Resumen:

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Conexión a Neon. |
| `BETTER_AUTH_SECRET` | Firma de sesiones. |
| `BETTER_AUTH_URL`, `APP_URL` | URL pública (links de los mails). |
| `SUPERADMIN_EMAILS` | Emails del equipo (separados por coma). |
| `SUPERADMIN_NOTIFY_EMAILS` | Quién recibe el aviso de nuevas solicitudes. |
| `MAIL_PROVIDER`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Envío de mails (Gmail con contraseña de aplicación). Sin SMTP los mails solo quedan en el outbox. |
| `CRON_SECRET` | Protege el cron de vencimientos. |
| `SEED_DEMO` | `true` carga locales y eventos de ejemplo. |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_WHATSAPP` | Botón de contacto para locales en la landing. |

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completá DATABASE_URL, BETTER_AUTH_SECRET, etc.
npm run db:migrate           # crea las tablas en Neon (y los datos demo si SEED_DEMO=true)
npm run dev                  # http://localhost:3000
```

Otros scripts: `npm run build` (migra y compila), `npm run images:webp` (convierte imágenes PNG de `public/images` a WebP).

## Deploy

1. Push a `main` → Vercel compila y publica (la rama `main` es producción).
2. El build corre `scripts/migrate.mjs` antes de `next build`, así el esquema de Neon queda siempre al día.
3. Cargar en Vercel las variables de `.env.example` (sin las de ejemplo de demo si no corresponden).
4. Primer acceso del equipo: entrar a la plataforma con un email de `SUPERADMIN_EMAILS` y usar "Primer ingreso" para recibir el link de contraseña.
