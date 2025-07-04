// Configuración de la conexión a la base de datos PostgreSQL usando Sequelize
// Lee variables de entorno para host, usuario, contraseña, base de datos y puerto

import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config()

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false
    }
)

export default sequelize