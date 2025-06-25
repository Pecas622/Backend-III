import { Router } from "express";
import viewsRouter from "./views.router.js";
import apiRouter from "./api.router.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Views
 *     description: Rutas públicas del frontend (vistas)
 *   - name: API
 *     description: Rutas base de la API (agrupan productos, usuarios, carritos, etc.)
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Ruta principal del frontend
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Página principal renderizada

 * /api:
 *   get:
 *     summary: Ruta base de la API
 *     tags: [API]
 *     responses:
 *       200:
 *         description: Bienvenida a la API
 */

router.use("/", viewsRouter);
router.use("/api", apiRouter);

export default router;
