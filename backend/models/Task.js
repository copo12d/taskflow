import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending',
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
  },
  {
    timestamps: true,
})

export default Task