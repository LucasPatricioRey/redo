# REDO

Sitio full stack para una barberia/peluqueria moderna, pensado para operar con una presencia digital profesional y una base tecnica lista para reservas online.

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS 4
- MongoDB
- MongoDB Driver
- Zod
- Vercel

## Estructura

- `src/app`: rutas, landing y endpoints
- `src/lib`: configuracion, acceso a MongoDB y repositorios
- `docs`: definicion de producto

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Variables de entorno

Crear `.env.local` a partir de `.env.example` y completar `MONGODB_URI` y `MONGODB_DB_NAME`.

## Estado actual

- Landing inicial con identidad visual propia.
- Documentacion de concepto, MVP y roadmap.
- Endpoint `GET /api/health`.
- Endpoint `POST /api/bookings`.
- Integracion inicial con MongoDB para reservas.
