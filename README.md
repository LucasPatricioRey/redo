# REDO

REDO es una plataforma full stack para peluqueria y barberia orientada a un negocio real: servicios, profesionales, turnos online, disponibilidad por horario y panel administrativo sobre una misma base.

## Vista previa

![Vista previa de REDO](./readme-assets/home.png)

Demo online:

- App: [redo-rho-nine.vercel.app](https://redo-rho-nine.vercel.app)
- API: [redo-rho-nine.vercel.app/api/health](https://redo-rho-nine.vercel.app/api/health)
- Repositorio: [github.com/LucasPatricioRey/redo](https://github.com/LucasPatricioRey/redo)

## Que incluye

- landing comercial con identidad visual de marca
- catalogo de servicios con precios y duracion
- seleccion de profesionales y horarios disponibles
- reserva online con validaciones
- persistencia en MongoDB
- panel administrativo con login
- gestion de reservas, servicios, profesionales, horarios y bloqueos manuales

## Stack

### Frontend

- Vue 3
- Vue Router
- Vite
- Axios

### Backend

- Node.js
- Express
- MongoDB
- JWT para sesion de admin
- Cookies HTTP para autenticacion interna

## Estructura

```txt
redo/
  src/       frontend en Vue 3
  api/       entrypoint serverless para Vercel
  server/    logica de negocio, repositorios y autenticacion admin
  shared/    configuracion base del estudio y catalogo inicial
```

## Flujo principal

1. El usuario explora servicios y profesionales.
2. Selecciona fecha, profesional y servicio.
3. La app consulta disponibilidad real contra la API.
4. Se valida el turno y se registra la reserva en MongoDB.
5. El panel admin permite confirmar, editar, cancelar o eliminar reservas.
6. Tambien se pueden administrar servicios, profesionales, horarios y bloqueos manuales.

## Variables de entorno

```env
MONGODB_URI=...
MONGODB_DB_NAME=redo
ADMIN_USERNAME=admin
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

La API no inicia si falta `MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` o `ADMIN_SESSION_SECRET`.

Hay un archivo de ejemplo listo en:

- `.env.example`

## Instalacion local

### 1. Clonar el proyecto

```bash
git clone https://github.com/LucasPatricioRey/redo.git
cd redo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar entorno

Crear un archivo `.env.local` o `.env` usando como base `.env.example`.

### 4. Levantar el proyecto

Frontend + API local:

```bash
npm run dev:full
```

Solo frontend:

```bash
npm run dev
```

Solo API:

```bash
npm run dev:api
```

## Deploy

El proyecto esta preparado para desplegarse en Vercel como una sola app:

- frontend Vite en produccion
- API expuesta en `/api/*`
- rewrites ya configurados en `vercel.json`

La persistencia depende de MongoDB y de las variables de entorno de administracion.

## Estado actual

Hoy el proyecto ya cubre:

- experiencia publica de reserva
- disponibilidad dinamica por servicio y profesional
- gestion interna desde panel admin
- persistencia en base de datos
- deploy funcionando sobre Vercel

## Mejoras futuras posibles

- notificaciones de reserva por email o WhatsApp
- agenda visual por bloques horarios
- recordatorios automaticos
- analitica de reservas por periodo
- gestion de clientes frecuentes

## Autor

Desarrollado por [Lucas Patricio Rey](https://github.com/LucasPatricioRey).

## Licencia

MIT
