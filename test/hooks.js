import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

let mongoServer;

export const mochaHooks = {
    async beforeAll() {
        this.timeout(120000);
        let uri = process.env.MONGO_URI_TEST;
        if (!uri) {
            mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }
        await mongoose.connect(uri);
        await mongoose.connection.db.dropDatabase();
    },
    async afterAll() {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
        if (mongoServer) await mongoServer.stop();
    },
};
