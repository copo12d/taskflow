// Rutas de autenticación: registro, login, refresh y registro de admin
// Define los endpoints relacionados con usuarios y autenticación

import { Router } from 'express';
import { login, register, refresh, registerAdmin } from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);
router.post('/register-admin', registerAdmin);

export default router;
