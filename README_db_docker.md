# Inicialización de la base de datos con Docker

Este proyecto utiliza Docker para levantar una base de datos PostgreSQL de forma sencilla. Si no tienes PostgreSQL instalado localmente, puedes usar Docker siguiendo estos pasos:

1. Asegúrate de tener Docker instalado y en ejecución.
2. Copia el archivo `.env_ejemplo` como `.env` en la raíz del backend y ajusta los valores según tu entorno.
3. En la raíz del proyecto (donde está el archivo `docker-compose.yml`), ejecuta:

   ```bash
   docker compose up -d
   ```

   Esto levantará un contenedor de PostgreSQL accesible en el puerto definido en tu `.env`.

4. La base de datos se creará automáticamente con los datos de usuario, contraseña y nombre definidos en las variables de entorno.

5. Cuando termines, puedes detener el contenedor con:

   ```bash
   docker compose down
   ```

---
