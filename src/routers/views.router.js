import { Router } from "express";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Views
 *     description: Rutas públicas del sitio web (vistas renderizadas)
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Página principal del sitio
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Página principal renderizada
 */

export default router;
