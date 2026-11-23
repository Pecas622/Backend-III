import "dotenv/config.js";
import app from "./src/app.js";
import dbConnect from "./src/helpers/dbConnect.helper.js";

const port = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await dbConnect(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log("✅ Server ready on port " + port);
        });
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error);
        process.exit(1);
    }
};

startServer();
