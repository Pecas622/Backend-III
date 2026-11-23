import { petsManager } from "../dao/manager.mongo.js";
import { httpError, assertObjectId } from "../helpers/httpError.helper.js";

const getAllPets = async (req, res, next) => {
    try {
        const pets = await petsManager.readAll();
        res.status(200).json({ status: "success", payload: pets });
    } catch (error) {
        next(error);
    }
};

const getPet = async (req, res, next) => {
    try {
        const { pid } = req.params;
        assertObjectId(pid, "pet id");
        const pet = await petsManager.readById(pid);
        if (!pet) throw httpError("Pet not found", 404);
        res.status(200).json({ status: "success", payload: pet });
    } catch (error) {
        next(error);
    }
};

const createPet = async (req, res, next) => {
    try {
        const { name, specie, birthDate, image } = req.body;
        if (!name || !specie) throw httpError("Incomplete values: name and specie are required", 400);
        const pet = await petsManager.createOne({ name, specie, birthDate, image });
        res.status(201).json({ status: "success", payload: pet });
    } catch (error) {
        next(error);
    }
};

const deletePet = async (req, res, next) => {
    try {
        const { pid } = req.params;
        assertObjectId(pid, "pet id");
        const pet = await petsManager.destroyById(pid);
        if (!pet) throw httpError("Pet not found", 404);
        res.status(200).json({ status: "success", message: "Pet deleted" });
    } catch (error) {
        next(error);
    }
};

export { getAllPets, getPet, createPet, deletePet };
