# REDO

## Concepto del producto

REDO es una barberia/peluqueria premium con presencia digital moderna, pensada para clientes que valoran imagen, puntualidad y una experiencia cuidada de punta a punta. El objetivo del producto es unir una landing comercial fuerte con una capa operativa simple: captar turnos, mostrar servicios reales y dejar preparado un backoffice administrable.

## MVP recomendado

- Landing comercial con identidad de marca consistente.
- Seccion de servicios destacados con duracion y precios.
- Presentacion del equipo y propuesta de valor del negocio.
- Formulario/API para solicitudes de turno.
- Persistencia de reservas con MongoDB.
- Metadata, estructura y documentacion pensadas para un producto profesional.

## Funcionalidades para una segunda etapa

- Login para staff y panel admin.
- Gestion de turnos con estados y filtros.
- Disponibilidad real por profesional.
- Emails transaccionales y recordatorios.
- Galeria, testimonios y dashboard comercial.

## Stack recomendado

- Frontend + backend: Next.js 16 con App Router.
- Lenguaje: TypeScript.
- Estilos: Tailwind CSS 4.
- Base de datos: MongoDB.
- Acceso a datos: MongoDB Driver.
- Validacion: Zod.
- Deploy: Vercel.

## Estructura propuesta

- `src/app`: rutas, layout, pagina principal y endpoints.
- `src/lib`: configuracion, utilidades, acceso a MongoDB y repositorios.
- `docs`: definicion de producto y decisiones tecnicas.

## Uno o dos repos

Conviene arrancar con un solo repo. Un monolito bien resuelto comunica mejor criterio tecnico que una separacion artificial en frontend/backend. Si mas adelante REDO suma dashboard complejo, integraciones o app mobile, ahi si puede evaluarse dividir.

## Decision sobre MongoDB

Conviene usar MongoDB porque ya tenes experiencia previa con ese stack y te permite construir una solucion realista sin introducir complejidad nueva. Lo recomendable no es mezclar REDO con colecciones de otro sistema, sino crear una base propia como `redo` dentro de tu cluster actual para mantener orden, seguridad y escalabilidad.
