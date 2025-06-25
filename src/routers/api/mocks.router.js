import CustomRouter from "../../helpers/CustomRouter.helper.js";
import createMockProduct from "../../helpers/mocks/products.mock.js";
import createMockUser from "../../helpers/mocks/users.mock.js";
import { productsService, usersService } from "../../services/service.js";

/**
 * @swagger
 * tags:
 *   name: Mocks
 *   description: Generación de datos de prueba (mocks)
 *
 * /api/mocks/products/{n}:
 *   get:
 *     summary: Genera y guarda n productos mock en la base de datos
 *     tags: [Mocks]
 *     parameters:
 *       - in: path
 *         name: n
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cantidad de productos a generar
 *     responses:
 *       201:
 *         description: Mocks de productos creados
 *         content:
 *           application/json:
 *             example:
 *               mocks: 10
 *
 * /api/mocks/users/{n}:
 *   get:
 *     summary: Genera y guarda n usuarios mock en la base de datos
 *     tags: [Mocks]
 *     parameters:
 *       - in: path
 *         name: n
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cantidad de usuarios a generar
 *     responses:
 *       201:
 *         description: Mocks de usuarios creados
 *         content:
 *           application/json:
 *             example:
 *               mocks: 10
 */

class MocksRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.read("/products/:n", ["PUBLIC"], async (req, res) => {
      const { n } = req.params;
      for (let index = 0; index < n; index++) {
        const one = createMockProduct();
        await productsService.createOne(one);
      }
      res.json201({ mocks: n });
    });
    this.read("/users/:n", ["PUBLIC"], async (req, res) => {
      const { n } = req.params;
      for (let index = 0; index < n; index++) {
        const one = createMockUser();
        await usersService.createOne(one);
      }
      res.json201({ mocks: n });
    });
  };
}

const mocksRouter = new MocksRouter();
export default mocksRouter.getRouter();
