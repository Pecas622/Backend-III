import jsonwebtoken from "jsonwebtoken";

/**
 * @createToken
 * recibe información a tokenizar
 * devuelve un token protegido
 */
const createToken = (data) => {
    try {
        const token = jsonwebtoken.sign(data, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 * 7, // 7 días
        });
        return token;
    } catch (error) {
        error.statusCode = 401;
        throw error;
    }
};

/**
 * @verifyToken
 * recibe un token y lo verifica
 * devuelve el booleano o la información correspondiente
 */
const verifyToken = (token) => {
    try {
        const data = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        return data;
    } catch (error) {
        error.statusCode = 401;
        throw error;
    }
};

export { createToken, verifyToken };
