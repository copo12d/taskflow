import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import User from '../models/User.js';

const router = express.Router();

// Solo admin puede ver todos los usuarios
router.get('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso solo para administradores' });
  }
  try {
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

export default router;
