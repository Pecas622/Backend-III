import { createToken } from "../helpers/token.helper.js";

/**
 * Controlador para registro
 * Asume que passportCb('register') ya creó el usuario en req.user
 */
export const register = (req, res) => {
    if (!req.user) {
        return res.status(400).json({ error: "Error en registro" });
    }
    res.status(201).json({ message: "Usuario registrado con éxito" });
};

/**
 * Controlador para login
 * Asume que passportCb('login') autenticó y dejó usuario en req.user
 */
export const login = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Credenciales inválidas" });
    }
    // Crear token con datos relevantes
    const token = createToken({ email: req.user.email, role: req.user.role, id: req.user._id });
    res.status(200).json({ token });
};

export const signout = (req, res) => {
    req.logout(() => {
        res.status(200).json({ message: "Sesión cerrada con éxito" });
    });
};

export const online = (req, res) => {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });
    res.status(200).json({ user: req.user });
};

export const google = (req, res) => {
    res.status(200).json({ message: "Autenticado con Google", user: req.user });
};

export const failure = (req, res) => {
    res.status(401).json({ error: "Error en autenticación con Google" });
};
