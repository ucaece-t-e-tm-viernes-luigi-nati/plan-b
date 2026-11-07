// Crea/actualiza las tablas en Neon. Corre antes de cada build (ver "build" en package.json).
// Es idempotente: se puede correr muchas veces sin romper nada.
//   - Sin DATABASE_URL: se saltea (build local sin base).
//   - Planes (Inicial / Pro / Premium): se cargan siempre si no existen (son datos de referencia).
//   - SEED_DEMO=true: además carga 4 locales y 4 eventos de demostración (con fechas próximas).
import pg from 'pg'

if (!process.env.DATABASE_URL) {
  console.log('[migrate] Sin DATABASE_URL: se saltea la migración.')
  process.exit(0)
}

const TZ = 'America/Argentina/Buenos_Aires'

const schema = [
  // ---------- better-auth ----------
  `CREATE TABLE IF NOT EXISTS "user" (
    "id" text PRIMARY KEY,
    "name" text NOT NULL,
    "email" text NOT NULL UNIQUE,
    "emailVerified" boolean NOT NULL DEFAULT false,
    "image" text,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "session" (
    "id" text PRIMARY KEY,
    "expiresAt" timestamp NOT NULL,
    "token" text NOT NULL UNIQUE,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS "account" (
    "id" text PRIMARY KEY,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamp,
    "refreshTokenExpiresAt" timestamp,
    "scope" text,
    "password" text,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS "verification" (
    "id" text PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expiresAt" timestamp NOT NULL,
    "createdAt" timestamp DEFAULT now(),
    "updatedAt" timestamp DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS session_user_idx ON "session"("userId")`,
  `CREATE INDEX IF NOT EXISTS account_user_idx ON "account"("userId")`,
  `CREATE INDEX IF NOT EXISTS verification_identifier_idx ON "verification"("identifier")`,

  // ---------- roles ----------
  `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" text NOT NULL DEFAULT 'member'`,
  `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "mustChangePassword" boolean NOT NULL DEFAULT false`,
  `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "tempPasswordExpiresAt" timestamp`,

  // ---------- planes y clientes (locales) ----------
  `CREATE TABLE IF NOT EXISTS plan (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text,
    features jsonb NOT NULL DEFAULT '[]',
    monthly_price_cents bigint NOT NULL DEFAULT 0,
    currency text NOT NULL DEFAULT 'USD',
    trial_days int NOT NULL DEFAULT 14,
    limits jsonb NOT NULL DEFAULT '{}',
    sort int NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS client (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    legal_name text,
    tax_id text,
    city text,
    neighborhood text,
    address text,
    venue_type text,
    capacity int,
    instagram text,
    website text,
    phone text,
    contact_email text,
    description text,
    data jsonb NOT NULL DEFAULT '{}',
    plan_id text REFERENCES plan(id),
    monthly_price_cents bigint NOT NULL DEFAULT 0,
    currency text NOT NULL DEFAULT 'USD',
    status text NOT NULL DEFAULT 'trial' CHECK (status IN ('trial','active','past_due','paused','cancelled')),
    trial_ends_at date,
    billing_day int CHECK (billing_day BETWEEN 1 AND 28),
    next_due_date date,
    is_demo boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS client_status_idx ON client(status, next_due_date)`,
  `CREATE TABLE IF NOT EXISTS client_member (
    client_id uuid NOT NULL REFERENCES client(id) ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'staff' CHECK (role IN ('owner','staff')),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (client_id, user_id)
  )`,
  `CREATE INDEX IF NOT EXISTS client_member_user_idx ON client_member(user_id)`,

  // ---------- alta por link ----------
  `CREATE TABLE IF NOT EXISTS client_invite (
    token text PRIMARY KEY,
    kind text NOT NULL CHECK (kind IN ('personal','campaign')),
    email text,
    label text,
    max_uses int,
    uses int NOT NULL DEFAULT 0,
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz,
    created_by text REFERENCES "user"(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS client_application (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    invite_token text REFERENCES client_invite(token),
    resume_key text NOT NULL,
    email text NOT NULL,
    contact_name text,
    phone text,
    email_verified_at timestamptz,
    step int NOT NULL DEFAULT 1,
    data jsonb NOT NULL DEFAULT '{}',
    requested_plan_id text REFERENCES plan(id),
    terms_accepted_at timestamptz,
    status text NOT NULL DEFAULT 'draft'
      CHECK (status IN ('draft','pending_review','changes_requested','approved','rejected')),
    review_reason text,
    reviewed_by text REFERENCES "user"(id) ON DELETE SET NULL,
    reviewed_at timestamptz,
    submitted_at timestamptz,
    client_id uuid REFERENCES client(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS client_application_status_idx ON client_application(status, submitted_at)`,
  `CREATE INDEX IF NOT EXISTS client_application_token_idx ON client_application(invite_token)`,

  // ---------- cobros ----------
  `CREATE TABLE IF NOT EXISTS payment (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL REFERENCES client(id) ON DELETE CASCADE,
    period text NOT NULL,
    amount_cents bigint NOT NULL,
    currency text NOT NULL DEFAULT 'USD',
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','void')),
    method text,
    due_date date NOT NULL,
    paid_at timestamptz,
    notes text,
    registered_by text REFERENCES "user"(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (client_id, period)
  )`,

  // ---------- mails y auditoría ----------
  `CREATE TABLE IF NOT EXISTS email_outbox (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    to_email text NOT NULL,
    subject text NOT NULL,
    body_html text NOT NULL,
    body_text text,
    template text,
    status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed','outbox_only')),
    error text,
    created_at timestamptz NOT NULL DEFAULT now(),
    sent_at timestamptz
  )`,
  `CREATE INDEX IF NOT EXISTS email_outbox_created_idx ON email_outbox(created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS audit_log (
    id bigserial PRIMARY KEY,
    actor_user_id text,
    actor_role text,
    client_id uuid,
    action text NOT NULL,
    entity text,
    entity_id text,
    detail jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS audit_log_client_idx ON audit_log(client_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS audit_log_created_idx ON audit_log(created_at DESC)`,

  // ---------- negocio: eventos e interés ----------
  `CREATE TABLE IF NOT EXISTS event (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    client_id uuid NOT NULL REFERENCES client(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL DEFAULT '',
    category text NOT NULL CHECK (category IN ('Música','Gastronomía','Cultura','Ferias','Talleres')),
    starts_at timestamptz NOT NULL,
    price_label text NOT NULL DEFAULT 'Entrada gratuita',
    image_url text,
    neighborhood text,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
    created_by text REFERENCES "user"(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS event_public_idx ON event(status, starts_at)`,
  `CREATE INDEX IF NOT EXISTS event_client_idx ON event(client_id, starts_at)`,
  `CREATE TABLE IF NOT EXISTS event_interest (
    event_id text NOT NULL REFERENCES event(id) ON DELETE CASCADE,
    user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (event_id, user_id)
  )`,
  `CREATE INDEX IF NOT EXISTS event_interest_user_idx ON event_interest(user_id)`,
]

const plans = [
  ['inicial', 'Inicial', 'Para empezar a compartir lo que pasa en tu espacio.', ['Publicaciones básicas', 'Gestión de experiencias', 'Soporte por email'], 1500, 1],
  ['pro', 'Pro', 'Para llegar a más personas y entender qué les interesa.', ['Publicaciones destacadas', 'Analytics básico', 'Soporte prioritario'], 2900, 2],
  ['premium', 'Premium', 'Para crecer con máxima visibilidad y acompañamiento.', ['Máxima visibilidad', 'Analytics avanzado', 'Soporte dedicado'], 5900, 3],
]

const demoVenues = [
  ['lado-b-cafe', 'Lado B Café', 'Güemes', 'cafe', 'Café de especialidad en Güemes.'],
  ['club-tri', 'Club Tri', 'Playa Grande', 'club', 'Club de playa con terraza y música en vivo.'],
  ['casa-mero', 'Casa Mero', 'Centro', 'centro_cultural', 'Casona con ferias y muestras de diseño local.'],
  ['el-galpon-de-las-artes', 'El Galpón de las Artes', 'Puerto', 'centro_cultural', 'Teatro independiente en el Puerto.'],
]

// [id, slug del local, título, categoría, días desde hoy, hora, precio, imagen, barrio, descripción]
const demoEvents = [
  ['sunset-sessions', 'club-tri', 'Sunset sessions: música frente al mar', 'Música', 1, '20:30', 'Desde $4.500', '/images/event-coast.webp', 'Playa Grande',
    'Una tarde larga, bandas locales y el último sol sobre el mar. Vení temprano para disfrutar la terraza.'],
  ['cafe-de-origen', 'lado-b-cafe', 'Café de origen: cata y charla', 'Gastronomía', 2, '10:30', 'Entrada gratuita', '/images/event-coffee.webp', 'Güemes',
    'Probá cafés de especialidad de pequeños productores y aprendé a reconocer sus notas.'],
  ['feria-entremares', 'casa-mero', 'Entremares: feria de diseño local', 'Ferias', 2, '16:00', 'Entrada gratuita', '/images/event-market.webp', 'Centro',
    'Diseño independiente, cerámica, ilustración y proyectos hechos en Mar del Plata.'],
  ['impro-a-la-carta', 'el-galpon-de-las-artes', 'Impro a la carta', 'Cultura', 3, '21:00', 'Desde $6.000', '/images/event-theatre.webp', 'Puerto',
    'Una noche de teatro improvisado donde el público elige qué pasa en escena.'],
]

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
try {
  for (const sql of schema) await pool.query(sql)

  for (const [id, name, description, features, cents, sort] of plans) {
    await pool.query(
      `INSERT INTO plan (id, name, description, features, monthly_price_cents, currency, trial_days, sort)
       VALUES ($1, $2, $3, $4::jsonb, $5, 'USD', 14, $6) ON CONFLICT (id) DO NOTHING`,
      [id, name, description, JSON.stringify(features), cents, sort],
    )
  }

  // Superadmin: solo cuentas ya verificadas (creadas por el "primer ingreso" de /plataforma) cuyo email
  // está en SUPERADMIN_EMAILS. Nadie puede registrarse como superadmin desde el registro público.
  const superadmins = (process.env.SUPERADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  if (superadmins.length) {
    await pool.query(
      `UPDATE "user" SET role = 'superadmin' WHERE lower(email) = ANY($1) AND "emailVerified" = true AND role <> 'superadmin'`,
      [superadmins],
    )
  }
  await pool.query(`UPDATE "user" SET role = 'member' WHERE role = 'superadmin' AND NOT (lower(email) = ANY($1))`, [superadmins])

  if (process.env.SEED_DEMO === 'true') {
    for (const [slug, name, neighborhood, venueType, description] of demoVenues) {
      await pool.query(
        `INSERT INTO client (slug, name, city, neighborhood, venue_type, description, plan_id, monthly_price_cents, currency,
                             status, billing_day, next_due_date, is_demo)
         VALUES ($1, $2, 'Mar del Plata', $3, $4, $5, 'pro', 2900, 'USD', 'active', 10,
                 (date_trunc('month', current_date) + interval '1 month' + interval '9 days')::date, true)
         ON CONFLICT (slug) DO NOTHING`,
        [slug, name, neighborhood, venueType, description],
      )
    }
    for (const [id, slug, title, category, days, time, price, image, neighborhood, description] of demoEvents) {
      // Fecha relativa a hoy (hora de Argentina). Si el evento demo ya pasó, se vuelve a mover hacia adelante.
      await pool.query(
        `INSERT INTO event (id, client_id, title, description, category, starts_at, price_label, image_url, neighborhood, status)
         SELECT $1, c.id, $3, $4, $5,
                ((date_trunc('day', now() AT TIME ZONE '${TZ}') + make_interval(days => $6::int) + $7::time) AT TIME ZONE '${TZ}'),
                $8, $9, $10, 'published'
           FROM client c WHERE c.slug = $2
         ON CONFLICT (id) DO UPDATE SET starts_at = EXCLUDED.starts_at WHERE event.starts_at < now()`,
        [id, slug, title, description, category, days, time, price, image, neighborhood],
      )
    }
    console.log('[migrate] Datos de demo cargados (SEED_DEMO=true).')
  }

  console.log(`[migrate] OK (${schema.length} sentencias de esquema).`)
} finally {
  await pool.end()
}
