# Inicialización rápida de la base de datos con Docker

Este proyecto incluye un archivo `docker-compose.yml` para levantar una base de datos PostgreSQL fácilmente usando Docker.

**Pasos para iniciar la base de datos:**

1. Asegúrate de tener Docker instalado y en ejecución.
2. Copia el archivo `backend/.env_ejemplo` como `backend/.env` y ajusta los valores según tu entorno.
3. Desde la raíz del proyecto (donde está `docker-compose.yml`), ejecuta:
   ```bash
   docker compose up -d
   ```
   Esto levantará un contenedor de PostgreSQL accesible en el puerto definido en tu `.env`.
4. Cuando termines, puedes detener el contenedor con:
   ```bash
   docker compose down
   ```

---

# TaskFlow Backend

API RESTful para gestión de tareas con autenticación JWT, roles de usuario y refresh tokens. Permite registro, login, asignación de tareas y control de acceso por roles (admin/usuario).

## Características
- Autenticación con JWT y refresh tokens
- CRUD completo de tareas
- Roles: `admin` y `user`
- Asignación de tareas a usuarios
- Solo los admins pueden crear, modificar, eliminar y asignar tareas
- Los usuarios solo pueden ver y cambiar el estado de sus tareas
- Base de datos PostgreSQL (usando Sequelize)

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/copo12d/taskflow.git
   cd backend
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura el archivo `.env`:**
   Crea un archivo `.env` en la raíz con el siguiente contenido (ajusta según tu entorno):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_NAME=taskflow
   DB_USER=usuario_db
   DB_PASSWORD=tu_password
   DB_PORT=5432
   JWT_SECRET=clave_secreta_jwt
   JWT_REFRESH_SECRET=clave_refresh_jwt
   ```

4. **Configura la base de datos:**
   - Crea la base de datos en PostgreSQL con el nombre indicado en `.env`.
   - Ejecuta las migraciones si usas alguna, o deja que Sequelize cree las tablas automáticamente al iniciar.

5. **Inicia el servidor:**
   ```bash
   npm start
   ```

## Endpoints principales

### Autenticación
- `POST /api/auth/register` — Registrar usuario
- `POST /api/auth/register-admin` — Registrar admin
- `POST /api/auth/login` — Login
- `POST /api/auth/refresh` — Renovar token

### Tareas
- `GET /api/tasks` — Ver todas las tareas (autenticado)
- `GET /api/tasks/my` — Ver solo tus tareas asignadas
- `POST /api/tasks` — Crear tarea (solo admin)
- `PUT /api/tasks/:id` — Modificar tarea (solo admin)
- `DELETE /api/tasks/:id` — Eliminar tarea (solo admin)
- `POST /api/tasks/:id/assign` — Asignar tarea a usuario (solo admin)
- `PATCH /api/tasks/:id/status` — Cambiar estado de tarea (usuario asignado o admin)

## Ejemplo de uso en Postman

1. **Registrar un admin:**
   - POST `/api/auth/register-admin`
   - Body:
     ```json
     { "username": "admin1", "email": "admin1@demo.com", "password": "adminpass" }
     ```

2. **Login:**
   - POST `/api/auth/login`
   - Body:
     ```json
     { "email": "admin1@demo.com", "password": "adminpass" }
     ```
   - Guarda el token JWT de la respuesta.

3. **Crear tarea (como admin):**
   - POST `/api/tasks`
   - Headers: `Authorization: Bearer TU_TOKEN`
   - Body:
     ```json
     { "title": "Tarea 1", "description": "Descripción" }
     ```

4. **Registrar usuario normal:**
   - POST `/api/auth/register`
   - Body:
     ```json
     { "username": "user1", "email": "user1@demo.com", "password": "userpass" }
     ```

5. **Asignar tarea a usuario:**
   - POST `/api/tasks/1/assign`
   - Headers: `Authorization: Bearer TU_TOKEN_ADMIN`
   - Body:
     ```json
     { "userId": 2 }
     ```

6. **Ver tareas asignadas (como usuario):**
   - GET `/api/tasks/my`
   - Headers: `Authorization: Bearer TU_TOKEN_USER`

7. **Cambiar estado de tarea (como usuario):**
   - PATCH `/api/tasks/1/status`
   - Headers: `Authorization: Bearer TU_TOKEN_USER`
   - Body:
     ```json
     { "status": "completed" }
     ```

## Estructura del proyecto

- `controllers/` — Lógica de negocio
- `routes/` — Definición de rutas
- `middlewares/` — Middlewares de autenticación y roles
- `models/` — Modelos Sequelize
- `config/` — Configuración de base de datos
- `utils/` — Utilidades (JWT)

## Notas
- Cambia las claves secretas y credenciales antes de producción.
- Puedes extender la API para más entidades o funcionalidades.

---

¡Listo para usar y subir a GitHub!
