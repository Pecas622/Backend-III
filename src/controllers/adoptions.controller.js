import { adoptionsManager, petsManager, usersManager } from "../dao/manager.mongo.js";
import { httpError, assertObjectId } from "../helpers/httpError.helper.js";

const getAllAdoptions = async (req, res, next) => {
    try {
        const adoptions = await adoptionsManager.readAll();
        res.status(200).json({ status: "success", payload: adoptions });
    } catch (error) {
        next(error);
    }
};

const getAdoption = async (req, res, next) => {
    try {
        const { aid } = req.params;
        assertObjectId(aid, "adoption id");
        const adoption = await adoptionsManager.readById(aid);
        if (!adoption) throw httpError("Adoption not found", 404);
        res.status(200).json({ status: "success", payload: adoption });
    } catch (error) {
        next(error);
    }
};

const createAdoption = async (req, res, next) => {
    try {
        const { uid, pid } = req.params;
        assertObjectId(uid, "user id");
        assertObjectId(pid, "pet id");

        const user = await usersManager.readById(uid);
        if (!user) throw httpError("User not found", 404);

        const pet = await petsManager.readById(pid);
        if (!pet) throw httpError("Pet not found", 404);
        if (pet.adopted) throw httpError("Pet is already adopted", 400);

        await usersManager.updateById(uid, { $push: { pets: pet._id } });
        await petsManager.updateById(pid, { adopted: true, owner: user._id });
        const adoption = await adoptionsManager.createOne({ owner: user._id, pet: pet._id });

        res.status(201).json({ status: "success", message: "Pet adopted", payload: adoption });
    } catch (error) {
        next(error);
    }
};

export { getAllAdoptions, getAdoption, createAdoption };
