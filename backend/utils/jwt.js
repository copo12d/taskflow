// Utilidades para generación y verificación de tokens JWT y refresh tokens
// Incluye funciones para crear, verificar y renovar tokens

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

//Generar token de acceso

export function generateAccessToken(user) {
    return jwt.sign(
        { id:user.id, role:user.role },
        JWT_SECRET,
        { expiresIn:'40m' }
    )
}

// Generar refresh token

export function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.id },
        JWT_REFRESH_SECRET,
        { expiresIn:'40m' }
    )
}

// Verificar access token

export function verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

// Verificar refresh token

export function verifyRefreshToken(token) {
    return jwt.verify(token, JWT_REFRESH_SECRET);
}