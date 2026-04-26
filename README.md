# REDO

Proyecto full stack de portfolio para una barberia/peluqueria moderna. La idea es que REDO se vea profesional, usable y cercano a un negocio real, sin perder foco en mostrar criterio tecnico y buena presentacion en GitHub.

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Prisma
- PostgreSQL
- Zod
- Vercel

## Estructura

- `src/app`: rutas, landing y endpoints
- `src/lib`: configuracion y acceso a datos
- `prisma`: esquema inicial
- `docs`: definicion de producto

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run prisma:generate
npm run db:push
```

## Variables de entorno

Crear `.env.local` a partir de `.env.example` y completar:

```bash
DATABASE_URL=
```

## Estado actual

- Landing inicial con identidad visual propia.
- Documentacion de concepto, MVP y roadmap.
- Endpoint `GET /api/health`.
- Endpoint `POST /api/bookings`.
- Esquema Prisma inicial para servicios, equipo y reservas.
