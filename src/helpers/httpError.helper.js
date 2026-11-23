import { isValidObjectId } from "mongoose";

const httpError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const assertObjectId = (id, label = "id") => {
    if (!isValidObjectId(id)) throw httpError(`Invalid ${label}`, 400);
};

export { httpError, assertObjectId };
