import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

// Controlador de autenticación: gestiona registro, login, refresh y registro de admin
// Implementa la lógica de negocio para usuarios y autenticación

export const register = async (req, res) => {
    try {
        const {username, email, password, role} = req.body;

        const existing = await User.findOne({ where: {email} });
        if (existing) {
            return res.status(400).json({message: "El usuario ya existe"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "user"
        });
        
        // Generar tokens igual que en login
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);
        
        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({message: "Error en el servidor"});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({ where: {email} });
        if (!user) {
            return res.status(400).json({message: "Credenciales inválidas"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Credenciales inválidas"});
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({message: "Error en el servidor"});
    }
}

export const refresh = (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(401).json({ message: "Token requerido" });
        }

        const payload = verifyRefreshToken(token);
        const user = { id: payload.id }; // Solo necesitamos el ID para generar un nuevo access token
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newAccessToken = generateAccessToken(user);

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("Error en refresh token:", error);
        res.status(403).json({ message: "Token inválido" });
    }
}

export const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "admin"
        });
        
        // Generar tokens igual que en login
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);
        
        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Error en registro de admin:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
