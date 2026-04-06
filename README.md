<h1 align="center">KeepTab</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Zod-4.x-3E67B8?logoColor=white" alt="Zod" />
</p>

<p align="center">
  Sistema de gestión de punto de venta y control de inventario. Administar productos, clientes, ventas, abonos y jornadas de trabajo.
</p>




## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Tecnologías](#tecnologías)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecución](#ejecución)
- [Base de Datos](#base-de-datos)
- [Modelo de Datos](#modelo-de-datos)
- [API REST — Referencia de Endpoints](#api-rest--referencia-de-endpoints)
- [Scripts Disponibles](#scripts-disponibles)
- [Autores](#autores)




## Características Principales

- **Gestión de Productos** — registro, actualización y eliminación de productos con control de stock y precios
- **Control de Clientes** — registro de clientes con historial de compras
- **Sistema de Ventas** — registro de ventas con detalles y seguimiento de pagos
- **Abonos** — sistema de pagos parciales para ventas a crédito
- **Jornadas** — control de turnos y jornadas de trabajo
- **Gestión de Usuarios** — administración de cuentas de acceso al sistema
- **Autenticación JWT** — seguridad con Access tokens (15 min) y Refresh tokens (7 días)
- **Rate Limiting** — protección contra abusos en endpoints de autenticación
- **Validación con Zod** — validación robusta de datos de entrada en backend




## Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | Entorno de ejecución JavaScript |
| [Express](https://expressjs.com/) | 5.x | Framework web HTTP |
| [TypeORM](https://typeorm.io/) | 0.3.x | ORM para PostgreSQL |
| [PostgreSQL](https://www.postgresql.org/) | 14+ | Base de datos relacional |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9.x | Generación y verificación de tokens JWT |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | 6.x | Hashing seguro de contraseñas |
| [Zod](https://zod.dev/) | 4.x | Validación y tipado de esquemas |
| [cors](https://github.com/expressjs/cors) | 2.x | Manejo de Cross-Origin Resource Sharing |
| [helmet](https://github.com/helmetjs/helmet) | 8.x | Seguridad HTTP |
| [express-rate-limit](https://github.com/expressjs/express-rate-limit) | 8.x | Rate limiting |
| [pg](https://node-postgres.com/) | 8.x | Cliente PostgreSQL para Node.js |
| [dotenv](https://github.com/motdotla/dotenv) | 17.x | Carga de variables de entorno |
| [nodemon](https://nodemon.io/) | 3.x | Recarga automática en desarrollo |




## Arquitectura del Proyecto

El backend sigue una arquitectura en **3 capas** (Controller → Service → Repository) con separación clara de responsabilidades.

```
KeepTab/
│
├── server/                      # Backend — Express 5 + TypeORM + PostgreSQL
│   ├── src/
│   │   ├── config/              # Conexión a la base de datos
│   │   ├── controllers/        # Controladores HTTP (1 por entidad)
│   │   ├── middlewares/         # Capa de seguridad (JWT, rate limiting)
│   │   ├── models/             # Entidades de TypeORM
│   │   ├── repositories/       # Capa de acceso a datos
│   │   ├── routes/             # Definición de rutas Express
│   │   ├── schemas/            # DTOs con Zod
│   │   ├── services/           # Lógica de negocio
│   │   └── index.ts           # Punto de entrada
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```




## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| Node.js | 18.x | [nodejs.org](https://nodejs.org/) |
| pnpm | 10.x | [pnpm.io](https://pnpm.io/) |
| PostgreSQL | 14.x | [postgresql.org/download](https://www.postgresql.org/download/) |




## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Luizzz1114/KeepTab.git
cd KeepTab
```

### 2. Instalar dependencias

```bash
cd server
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` dentro de la carpeta `server/` con el siguiente contenido:

```env
# ── Base de datos PostgreSQL ──
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=tu_contraseña_de_postgres
PG_DATABASE=keeptab

# ── Servidor ──
PORT=3000

# ── Autenticación JWT ──
JWT_ACCESS_SECRET=una_clave_secreta_larga_y_segura
JWT_REFRESH_SECRET=otra_clave_secreta_larga_y_segura

# ── CORS ──
CORS_ORIGIN=http://localhost:5173
```

| Variable | Descripción |
|---|---|
| `PG_HOST` | Host del servidor de base de datos |
| `PG_PORT` | Puerto de PostgreSQL (por defecto `5432`) |
| `PG_USER` | Usuario de PostgreSQL |
| `PG_PASSWORD` | Contraseña del usuario de PostgreSQL |
| `PG_DATABASE` | Nombre de la base de datos |
| `PORT` | Puerto donde se ejecutará el servidor Express (por defecto `3000`) |
| `JWT_ACCESS_SECRET` | Clave secreta para firmar access tokens (15 min de duración) |
| `JWT_REFRESH_SECRET` | Clave secreta para firmar refresh tokens (7 días de duración) |
| `CORS_ORIGIN` | Origen permitido para CORS |




## Ejecución

### Modo desarrollo

```bash
cd server
pnpm dev
```

El servidor estará disponible en `http://localhost:3000/keeptab-api`




## Base de Datos

### Configuración

El backend utiliza **TypeORM** para la conexión y gestión de la base de datos. La configuración se encuentra en `server/src/config/database.ts`.

### Entidades disponibles

El sistema cuenta con las siguientes entidades:

- `Productos` — Inventario de productos
- `Clientes` — Registro de clientes
- `Ventas` — Registro de ventas
- `DetallesVentas` — Detalles de cada venta
- `Abonos` — Pagos parciales de ventas a crédito
- `Jornadas` — Control de jornadas de trabajo
- `Usuarios` — Cuentas de acceso al sistema




## Modelo de Datos

### 1. Productos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL | Identificador único |
| `nombre` | VARCHAR | Nombre del producto |
| `precio` | DECIMAL(10,2) | Precio del producto |
| `conteo` | BOOLEAN | Control de inventario por unidad |
| `stock` | INTEGER | Cantidad en bodega |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |
| `deleted_at` | TIMESTAMP | Fecha de eliminación lógica |

### 2. Clientes

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL | Identificador único |
| `cedula` | VARCHAR | Cédula de identidad |
| `nombre` | VARCHAR | Nombre completo |
| `telefono` | VARCHAR | Teléfono de contacto |
| `direccion` | TEXT | Dirección de entrega |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |
| `deleted_at` | TIMESTAMP | Fecha de eliminación lógica |

### 3. Ventas

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL | Identificador único |
| `total` | DECIMAL(10,2) | Total de la venta |
| `fecha` | TIMESTAMP | Fecha de la venta |
| `estatus` | VARCHAR | Estado (pendiente, completada, cancelada) |
| `cliente_id` | INTEGER | FK → Clientes |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

### 4. DetallesVentas

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL | Identificador único |
| `cantidad` | INTEGER | Cantidad del producto |
| `precio` | DECIMAL(10,2) | Precio unitario |
| `venta_id` | INTEGER | FK → Ventas |
| `producto_id` | INTEGER | FK → Productos |

### 5. Abonos

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL | Identificador único |
| `monto` | DECIMAL(10,2) | Monto del abono |
| `fecha` | TIMESTAMP | Fecha del abono |
| `venta_id` | INTEGER | FK → Ventas |
| `created_at` | TIMESTAMP | Fecha de creación |

### 6. Jornadas

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL | Identificador único |
| `fecha` | DATE | Fecha de la jornada |
| `hora_entrada` | TIME | Hora de entrada |
| `hora_salida` | TIME | Hora de salida |
| `usuario_id` | INTEGER | FK → Usuarios |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

### 7. Usuarios

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL | Identificador único |
| `username` | VARCHAR | Nombre de usuario único |
| `nombre` | VARCHAR | Nombre completo |
| `passwordHash` | VARCHAR | Hash de contraseña |
| `refreshToken` | VARCHAR | Token de刷新 (opcional) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |
| `deleted_at` | TIMESTAMP | Fecha de eliminación lógica |




## API REST — Referencia de Endpoints

**URL base:** `/keeptab-api`

### Autenticación (`/auth`)

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión — devuelve access y refresh token | No |
| `POST` | `/auth/refresh` | Renovar access token | Sí |
| `POST` | `/auth/logout` | Cerrar sesión | Sí |

### Productos (`/productos`)

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| `GET` | `/productos` | Listar todos los productos | Sí |
| `GET` | `/productos/:id` | Obtener producto por ID | Sí |
| `POST` | `/productos` | Crear nuevo producto | Sí |
| `PATCH` | `/productos/:id` | Actualizar producto | Sí |
| `DELETE` | `/productos/:id` | Eliminar producto | Sí |

### Clientes (`/clientes`)

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| `GET` | `/clientes` | Listar todos los clientes | Sí |
| `GET` | `/clientes/:id` | Obtener cliente por ID | Sí |
| `POST` | `/clientes` | Crear nuevo cliente | Sí |
| `PATCH` | `/clientes/:id` | Actualizar cliente | Sí |
| `DELETE` | `/clientes/:id` | Eliminar cliente | Sí |

### Ventas (`/ventas`)

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| `GET` | `/ventas` | Listar todas las ventas | Sí |
| `GET` | `/ventas/:id` | Obtener venta por ID | Sí |
| `POST` | `/ventas` | Crear nueva venta | Sí |
| `PATCH` | `/ventas/:id` | Actualizar venta | Sí |
| `DELETE` | `/ventas/:id` | Eliminar venta | Sí |

### Abonos (`/abonos`)

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| `GET` | `/abonos` | Listar todos los abonos | Sí |
| `GET` | `/abonos/:id` | Obtener abono por ID | Sí |
| `POST` | `/abonos` | Registrar abono | Sí |

### Jornadas (`/jornadas`)

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| `GET` | `/jornadas` | Listar todas las jornadas | Sí |
| `GET` | `/jornadas/:id` | Obtener jornada por ID | Sí |
| `POST` | `/jornadas` | Registrar jornada | Sí |
| `PATCH` | `/jornadas/:id` | Actualizar jornada | Sí |

### Usuarios (`/usuarios`)

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| `GET` | `/usuarios` | Listar todos los usuarios | Sí |
| `GET` | `/usuarios/:id` | Obtener usuario por ID | Sí |
| `POST` | `/usuarios` | Crear nuevo usuario | Sí |
| `PATCH` | `/usuarios/:id` | Actualizar usuario | Sí |
| `DELETE` | `/usuarios/:id` | Eliminar usuario | Sí |




## Autenticación

Todos los endpoints (excepto `/auth/login`) requieren el header de autorización:

```
Authorization: Bearer <access_token>
```

El **access token** expira en **15 minutos**. Usa el **refresh token** para obtener uno nuevo mediante el endpoint `/auth/refresh`.

### Flujo de autenticación

1. **Login:** `POST /auth/login` → recibe `accessToken` y `refreshToken`
2. **Acceso:** usa `accessToken` en el header `Authorization: Bearer <token>`
3. **Refresh:** cuando el access token expire, usa `POST /auth/logout` con el refresh token para uno nuevo
4. **Logout:** `POST /auth/logout` para cerrar sesión




## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor con **Nodemon** (recarga automática al guardar cambios) |




## Autores

Luis Cortesía