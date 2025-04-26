
---

# Contact API – Prueba Técnica Metrix

Este proyecto es una API RESTful desarrollada con NestJS para gestionar envíos de formularios de contacto. Permite almacenar los datos en una base de datos PostgreSQL, enviar correos de confirmación al usuario y notificación al administrador, y consultar métricas básicas.

---

## Descripción del Proyecto

- Lenguaje: TypeScript
- Framework: NestJS
- Base de datos: PostgreSQL
- ORM: TypeORM
- Envío de correos: Nodemailer + Mailtrap/Gmail
- Validación avanzada: `class-validator`, `libphonenumber-js`
- Dockerizado con PostgreSQL incluido

---

## Configuración del entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_password
DATABASE_NAME=contacts_db

ADMIN_EMAIL=admin@example.com
EMAIL_USER=mailtrap_o_gmail_user
EMAIL_PASS=mailtrap_o_gmail_password
```

Si usas Gmail, asegúrate de utilizar una contraseña de aplicación (App Password).

---

## Instalación de dependencias

Con npm:

```
npm install
```

Con yarn:

```
yarn install
```

---

## Ejecutar la aplicación

### Modo local:

```
npm run start:dev
```

### Modo producción con Docker:

```
docker-compose up --build
```

Esto levanta tanto el backend como PostgreSQL.

---

## Endpoints disponibles

### POST /api/contact-submissions

Crea un nuevo formulario de contacto.

**Body JSON de ejemplo:**

```
{
  "fullName": "Juan Pérez",
  "email": "juan@example.com",
  "country": "CO",
  "phone": "+573001234567",
  "message": "Me gustaría saber más sobre sus servicios."
}
```

**Respuesta esperada:**

```
{
  "mensaje": "Formulario recibido correctamente."
}
```

---

### GET /api/metrics/daily-submissions

Devuelve el número de formularios enviados en el día actual.

**Respuesta esperada:**

```
{
  "conteo": 3
}
```

---

### GET /api/metrics/submissions-by-country

Devuelve la cantidad de formularios agrupados por país.

**Respuesta esperada:**

```
[
  { "pais": "CO", "conteo": 5 },
  { "pais": "MX", "conteo": 2 }
]
```

---

## Uso con Docker

Este proyecto incluye un `Dockerfile` y `docker-compose.yml`. Para levantar el backend con la base de datos:

```
docker-compose up --build
```

La API estará disponible en `http://localhost:3000`.

---

### Preguntas de Razonamiento

**1. Arquitectura y Diseño:**

Elegí NestJS por su estructura modular, su sistema de inyección de dependencias y su soporte nativo para validación, pruebas y documentación. El proyecto está dividido en módulos (`contact-submissions`, `metrics`, `mail`), cada uno con su propio servicio, controlador y entidad. Se aplicó una arquitectura de capas basada en principios SOLID. La base de datos usa una única tabla `contact_submissions` con campos simples y normalizados, incluyendo una columna `created_at` para facilitar métricas temporales.

---

**2. Escalabilidad y Mejoras:**

En un escenario con miles de envíos por hora, los principales cuellos de botella estarían en:
- **Envío de correos:** puede bloquear el flujo de la API.
- **Consultas a la base de datos sin índices.**

Estrategias:
- Usar colas de trabajo (ej. Bull + Redis) para enviar correos asincrónicamente.
- Añadir índices sobre `created_at` y `country`.
- Escalar la BD vertical u horizontalmente y usar read replicas.

Mejoras funcionales:
- Autenticación y panel admin para visualizar métricas.
- Endpoint para exportar datos en CSV o Excel.

---

**3. Alternativas y Trade-offs:**

Consideré usar Prisma en lugar de TypeORM, pero opté por TypeORM por su integración nativa con NestJS sin SDK adicional. Para validaciones, `Zod` fue evaluado, pero `class-validator` es más compatible con los DTOs de Nest. Para el envío de correos, Nodemailer fue suficiente, aunque para producción sería ideal usar un proveedor como SendGrid o SES. Se sacrificaron pruebas unitarias por tiempo, pero el diseño permite agregarlas fácilmente.

---

**4. Endpoint de Métricas:**

El endpoint `GET /api/metrics/daily-submissions` se implementó usando `Between(startOfDay, now)` con TypeORM para filtrar por `created_at`. Es eficiente si se indexa ese campo. Para métricas por país o rango de fechas, diseñaría endpoints que acepten filtros vía query params (`?country=CO&from=2025-04-20&to=2025-04-25`) y usaría `WHERE` dinámicos con `QueryBuilder`.

---