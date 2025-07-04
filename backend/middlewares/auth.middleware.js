import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware de autenticación JWT
// Verifica el token de acceso en las peticiones protegidas y añade el usuario al request
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Formato esperado: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // id y role
    next();
  } catch (error) {
    console.error('❌ Token inválido:', error.message);
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};
