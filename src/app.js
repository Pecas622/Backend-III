import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { serve, setup } from "swagger-ui-express";
import errorHandler from "./middlewares/errorHandler.mid.js";
import router from "./routers/index.router.js";
import swaggerSpec from "./helpers/swagger.helper.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.use("/api/docs", serve, setup(swaggerSpec));
app.use("/", router);
app.use(errorHandler);

export default app;
