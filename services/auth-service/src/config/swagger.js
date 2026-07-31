const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "F1 Drivers API",

            version: "1.0.0",

            description:
                "Backend API for F1 Drivers Project"
        },

        servers: [
            {
                url: "http://localhost:5000"
            }
        ]
    },

    apis: [
        "./src/routes/*.js"
    ]
};

module.exports =
swaggerJsDoc(options);