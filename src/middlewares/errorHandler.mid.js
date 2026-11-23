import errors from "../helpers/errors/errors.js";

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || errors.fatal.statusCode;
    if (process.env.NODE_ENV !== "test" || statusCode >= 500) console.error("🚨 Error capturado:", err);

    const { method, originalUrl: url } = req;
    const message = err.message || errors.fatal.message;

    res.status(statusCode).json({
        error: message,
        method,
        url,
        timestamp: new Date().toISOString(), 
    });
};

export default errorHandler;
