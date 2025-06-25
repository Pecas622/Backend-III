import CustomRouter from "../../helpers/CustomRouter.helper.js";
import { register, login, signout, online, google, failure } from "../../controllers/auth.controller.js";
import passportCb from "../../middlewares/passportCb.mid.js";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y sesiones
 * 
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *               city:
 *                 type: string
 *                 example: Mendoza
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuario registrado con éxito
 *       400:
 *         description: Error en datos de registro
 * 
 * /api/auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 * 
 * /api/auth/signout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada con éxito
 * 
 * /api/auth/online:
 *   get:
 *     summary: Verificar usuario online
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado
 * 
 * /api/auth/google:
 *   get:
 *     summary: Login con Google (inicia OAuth)
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirige a Google para autenticación
 * 
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback de Google OAuth
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Usuario autenticado con Google
 * 
 * /api/auth/google/failure:
 *   get:
 *     summary: Fallo en autenticación Google
 *     tags: [Auth]
 *     responses:
 *       401:
 *         description: Error en autenticación
 */

class AuthRouter extends CustomRouter {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        // Registro: Passport maneja la creación, luego control devolviendo 201
        this.create("/register", ["PUBLIC"], passportCb("register"), register);

        // Login: Passport autentica y luego controlador devuelve token
        this.create("/login", ["PUBLIC"], passportCb("login"), login);

        this.create("/signout", ["USER", "ADMIN"], signout);
        this.create("/online", ["USER", "ADMIN"], online);
        this.read("/google", ["PUBLIC"], passportCb("google"));
        this.read("/google/callback", ["PUBLIC"], passportCb("google"), google);
        this.read("/google/failure", ["PUBLIC"], failure);
    };
}

const authRouter = new AuthRouter();
export default authRouter.getRouter();
