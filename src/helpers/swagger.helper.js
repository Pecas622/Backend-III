import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Backend-III",
            version: "1.0.0",
            description: "Documentación generada con swagger-jsdoc",
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ["./src/routers/api/*.js"], // Apunta a donde están tus rutas documentadas
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
