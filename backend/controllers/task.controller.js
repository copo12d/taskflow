// Controlador de tareas: gestiona operaciones CRUD y asignación de tareas
// Implementa la lógica de negocio para tareas, asignación y cambio de estado

import { Task, User } from '../models/index.js';

// Obtener todas las tareas (solo admin)
export const getTasks = async (req, res) => {
  try {
    // Solo los admins pueden ver todas las tareas
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso solo para administradores' });
    }
    
    const tasks = await Task.findAll({
      include: [{
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'username', 'email']
      }]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error al obtener todas las tareas:', error);
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

// Crear tarea (solo admin)
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, userId } = req.body;
    const task = await Task.create({ title, description, priority, status: 'pending', userId: userId || null });
    // Devolver la tarea con el usuario asignado (si existe)
    const createdTask = await Task.findByPk(task.id, {
      include: [{ model: User, as: 'assignedUser', attributes: ['id', 'username', 'email'] }]
    });
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

// Modificar tarea (solo admin)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    task.title = title;
    task.description = description;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al modificar tarea' });
  }
};

// Eliminar tarea (solo admin)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    await task.destroy();
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};

// Asignar tarea a usuario (solo admin)
export const assignTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const task = await Task.findByPk(id);
    const user = await User.findByPk(userId);
    if (!task || !user) return res.status(404).json({ message: 'Tarea o usuario no encontrado' });
    task.userId = userId;
    await task.save();
    // Volver a consultar la tarea con el usuario asignado
    const updatedTask = await Task.findByPk(id, {
      include: [{ model: User, as: 'assignedUser', attributes: ['id', 'username', 'email'] }]
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar tarea' });
  }
};

// Modificar estado de tarea (solo usuario asignado o admin)
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
    // Solo el usuario asignado o admin puede cambiar el estado
    if (req.user.role !== 'admin' && req.user.id !== task.userId) {
      return res.status(403).json({ message: 'No autorizado para modificar el estado de esta tarea' });
    }
    task.status = status;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al modificar estado de tarea' });
  }
};

// Obtener tareas del usuario autenticado
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      include: [{ model: require('../models').User, as: 'assignedUser', attributes: ['id', 'username', 'email'] }]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus tareas' });
  }
};
