import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080/api");

describe("TESTEANDO AUTH & USERS", () => {
  let userId;
  let token;

  it("POST /auth/register", async () => {
    const response = await requester
      .post("/auth/register")
      .send({ email: "santizorrilla5@gmail.com", password: "Pecas622" });
    const { status, body } = response;

    // Si body.response es el usuario o el id, guardarlo
    // Sino, lo dejás para extraerlo del token luego
    userId = body.response?._id || body.response || null;

    expect(status).to.equal(201);
  });

  it("POST /auth/login", async () => {
    const response = await requester
      .post("/auth/login")
      .send({ email: "santizorrilla5@gmail.com", password: "Pecas622" });
    const { status, body } = response;

    token = body.token;
    expect(status).to.equal(200);
    expect(token).to.be.a("string");

    // Extraer userId del token si no se obtuvo en el registro
    if (!userId && token) {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
      userId = payload.user_id || payload.id || payload._id || null;
    }
  });

  it("PUT /users/:id → debe actualizar el usuario", async () => {
    expect(userId).to.not.be.null; // chequeo simple que userId esté definido

    const response = await requester
      .put(`/users/${userId}`)
      .send({ city: "Mendoza" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(200);
  });

  it("DELETE /users/:id → debe eliminar el usuario", async () => {
    expect(userId).to.not.be.null; // chequeo simple que userId esté definido

    const response = await requester
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(200);
  });
});
