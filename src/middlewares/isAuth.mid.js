import errors from "../helpers/errors/errors.js";
import { verifyToken } from "../helpers/token.helper.js";

function isAuth(req, res, next) {
    try {
        const header = req.headers?.authorization;
        const bearer = header?.startsWith("Bearer ") ? header.slice(7) : null;
        const token = req?.cookies?.token || bearer;
        if (!token) {
            const error = new Error(errors.invalid.message);
            error.statusCode = errors.invalid.statusCode;
            throw error;
        }
        const data = verifyToken(token);
        if (!data) {
            const error = new Error(errors.forbidden.message);
            error.statusCode = errors.forbidden.statusCode;
            throw error;
        }
        req.user = data;
        next();
    } catch (error) {
        next(error);
    }
}

export default isAuth;