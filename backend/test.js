import sequelize from './config/database.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL exitosa.');
  } catch (error) {
    console.error('❌ Error al conectar:', error);
  } finally {
    await sequelize.close();
  }
})();