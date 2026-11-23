import { Router } from "express";
import { getAllPets, getPet, createPet, deletePet } from "../../controllers/pets.controller.js";

const router = Router();

router.get("/", getAllPets);
router.get("/:pid", getPet);
router.post("/", createPet);
router.delete("/:pid", deletePet);

export default router;
