// Inicializa y exporta los modelos de Sequelize y sus relaciones

import User from './User.js';
import Task from './Task.js';

User.hasMany(Task, { foreignKey: "userId", as: "assignedTasks", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "userId", as: "assignedUser" });

export { User, Task };