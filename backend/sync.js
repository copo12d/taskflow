import sequelize from './config/database.js';
import { User, Task } from './models/index.js';

(async () => {
  try {
    await sequelize.sync({ alter: true }); // usar alter: true o force: true solo si lo controlas
    console.log('📦 Tablas sincronizadas con la base de datos');
  } catch (error) {
    console.error('❌ Error al sincronizar:', error);
  } finally {
    await sequelize.close();
  }
})();
// --- IGNORE ---