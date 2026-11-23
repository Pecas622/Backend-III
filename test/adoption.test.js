import { expect } from "chai";
import supertest from "supertest";
import { Types } from "mongoose";
import app from "../src/app.js";
import { usersManager, petsManager, adoptionsManager } from "../src/dao/manager.mongo.js";

const requester = supertest(app);

describe("Tests funcionales de adoption.router.js (/api/adoptions)", () => {
    let user;
    let pet;
    let adoptionId;

    before(async () => {
        user = await usersManager.createOne({
            email: `adopter_${Date.now()}@test.com`,
            password: "hashed",
        });
        const { body } = await requester
            .post("/api/pets")
            .send({ name: "Firulais", specie: "dog", birthDate: "2022-05-10" });
        pet = body.payload;
    });

    describe("GET /api/adoptions", () => {
        it("responde 200 con un array vacío cuando no hay adopciones", async () => {
            const { status, body } = await requester.get("/api/adoptions");
            expect(status).to.equal(200);
            expect(body.status).to.equal("success");
            expect(body.payload).to.be.an("array").that.is.empty;
        });
    });

    describe("POST /api/adoptions/:uid/:pid", () => {
        it("crea una adopción, marca la mascota como adoptada y la asigna al usuario", async () => {
            const { status, body } = await requester.post(`/api/adoptions/${user._id}/${pet._id}`);
            expect(status).to.equal(201);
            expect(body.status).to.equal("success");
            expect(body.payload).to.have.property("_id");
            expect(body.payload.owner).to.equal(String(user._id));
            expect(body.payload.pet).to.equal(String(pet._id));
            adoptionId = body.payload._id;

            const updatedPet = await petsManager.readById(pet._id);
            expect(updatedPet.adopted).to.equal(true);
            expect(String(updatedPet.owner)).to.equal(String(user._id));

            const updatedUser = await usersManager.readById(user._id);
            expect(updatedUser.pets.map(String)).to.include(String(pet._id));
        });

        it("responde 400 si la mascota ya fue adoptada", async () => {
            const { status, body } = await requester.post(`/api/adoptions/${user._id}/${pet._id}`);
            expect(status).to.equal(400);
            expect(body.error).to.equal("Pet is already adopted");
        });

        it("responde 404 si el usuario no existe", async () => {
            const { body: created } = await requester
                .post("/api/pets")
                .send({ name: "Michi", specie: "cat" });
            const fakeUid = new Types.ObjectId();
            const { status, body } = await requester.post(`/api/adoptions/${fakeUid}/${created.payload._id}`);
            expect(status).to.equal(404);
            expect(body.error).to.equal("User not found");
        });

        it("responde 404 si la mascota no existe", async () => {
            const fakePid = new Types.ObjectId();
            const { status, body } = await requester.post(`/api/adoptions/${user._id}/${fakePid}`);
            expect(status).to.equal(404);
            expect(body.error).to.equal("Pet not found");
        });

        it("responde 400 si el uid o el pid no son ObjectId válidos", async () => {
            const badUser = await requester.post(`/api/adoptions/abc/${pet._id}`);
            expect(badUser.status).to.equal(400);
            const badPet = await requester.post(`/api/adoptions/${user._id}/abc`);
            expect(badPet.status).to.equal(400);
        });

        it("no crea adopciones cuando la petición falla", async () => {
            const adoptions = await adoptionsManager.readAll();
            expect(adoptions).to.have.lengthOf(1);
        });
    });

    describe("GET /api/adoptions (con datos)", () => {
        it("responde 200 con la lista de adopciones", async () => {
            const { status, body } = await requester.get("/api/adoptions");
            expect(status).to.equal(200);
            expect(body.payload).to.be.an("array").with.lengthOf(1);
            expect(body.payload[0]._id).to.equal(adoptionId);
        });
    });

    describe("GET /api/adoptions/:aid", () => {
        it("responde 200 con la adopción solicitada", async () => {
            const { status, body } = await requester.get(`/api/adoptions/${adoptionId}`);
            expect(status).to.equal(200);
            expect(body.payload._id).to.equal(adoptionId);
            expect(body.payload.owner).to.equal(String(user._id));
            expect(body.payload.pet).to.equal(String(pet._id));
        });

        it("responde 404 si la adopción no existe", async () => {
            const { status, body } = await requester.get(`/api/adoptions/${new Types.ObjectId()}`);
            expect(status).to.equal(404);
            expect(body.error).to.equal("Adoption not found");
        });

        it("responde 400 si el id no es un ObjectId válido", async () => {
            const { status, body } = await requester.get("/api/adoptions/123");
            expect(status).to.equal(400);
            expect(body.error).to.equal("Invalid adoption id");
        });
    });
});
