# REDO Studio

Sitio web de barberia y estudio de imagen con reservas online, panel administrativo y disponibilidad real por profesional.

## Stack

- Vue 3
- Vite
- Pinia
- Vue Router
- Node.js
- Express
- MongoDB

## Variables de entorno

Crear un archivo `.env.local` con estas variables:

```env
MONGODB_URI=
MONGODB_DB_NAME=redo
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

## Desarrollo local

Frontend:

```bash
npm run dev
```

API:

```bash
npm run dev:api
```

Ambos al mismo tiempo:

```bash
npm run dev:full
```

## Produccion

```bash
npm run build
```
