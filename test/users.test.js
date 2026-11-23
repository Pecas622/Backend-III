import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";

const requester = supertest(app);

describe("Tests de Auth y Users (/api/auth, /api/users)", () => {
    const credentials = { email: `user_${Date.now()}@test.com`, password: "Test1234" };
    let token;

    it("POST /api/auth/register registra un usuario (201)", async () => {
        const { status } = await requester.post("/api/auth/register").send(credentials);
        expect(status).to.equal(201);
    });

    it("POST /api/auth/register rechaza un email repetido (401)", async () => {
        const { status } = await requester.post("/api/auth/register").send(credentials);
        expect(status).to.equal(401);
    });

    it("POST /api/auth/login devuelve un token (200)", async () => {
        const { status, body } = await requester.post("/api/auth/login").send(credentials);
        expect(status).to.equal(200);
        expect(body.token).to.be.a("string");
        token = body.token;
    });

    it("POST /api/auth/login rechaza una contraseña incorrecta (401)", async () => {
        const { status } = await requester
            .post("/api/auth/login")
            .send({ ...credentials, password: "wrong" });
        expect(status).to.equal(401);
    });

    it("GET /api/users sin token responde 401", async () => {
        const { status } = await requester.get("/api/users");
        expect(status).to.equal(401);
    });

    it("GET /api/users devuelve el perfil del usuario logueado", async () => {
        const { status, body } = await requester
            .get("/api/users")
            .set("Authorization", `Bearer ${token}`);
        expect(status).to.equal(200);
        expect(body.response.email).to.equal(credentials.email);
    });

    it("PUT /api/users actualiza el usuario logueado", async () => {
        const { status, body } = await requester
            .put("/api/users")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Santiago" });
        expect(status).to.equal(200);
        expect(body.response.name).to.equal("Santiago");
    });

    it("DELETE /api/users elimina el usuario logueado", async () => {
        const { status } = await requester
            .delete("/api/users")
            .set("Authorization", `Bearer ${token}`);
        expect(status).to.equal(200);
    });
});
