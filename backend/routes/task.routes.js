// Rutas de tareas: CRUD, asignación y cambio de estado
// Define los endpoints relacionados con la gestión de tareas
// Permite a los administradores crear, modificar y eliminar tareas
// Los usuarios pueden ver y actualizar el estado de sus tareas asignadas

import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { 
  createTask, 
  updateTask, 
  deleteTask, 
  assignTask, 
  updateTaskStatus, 
  getTasks,
  getMyTasks 
} from '../controllers/task.controller.js';

const router = express.Router();

// Middleware para verificar si el usuario es admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Acceso solo para administradores' });
  }
};

// Obtener todas las tareas (opcional, según necesidades)
router.get('/', verifyToken, getTasks);

// Obtener tareas asignadas al usuario autenticado
router.get('/my', verifyToken, getMyTasks);

// Crear tarea (solo admin)
router.post('/', verifyToken, isAdmin, createTask);

// Modificar tarea (solo admin)
router.put('/:id', verifyToken, isAdmin, updateTask);

// Eliminar tarea (solo admin)
router.delete('/:id', verifyToken, isAdmin, deleteTask);

// Asignar tarea a usuario (solo admin)
router.post('/:id/assign', verifyToken, isAdmin, assignTask);

// Modificar estado de tarea (solo usuario asignado o admin)
router.patch('/:id/status', verifyToken, updateTaskStatus);

export default router;
