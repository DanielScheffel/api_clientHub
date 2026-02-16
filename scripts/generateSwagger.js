import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import yaml from "yaml";


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API ClientHub",
            version: "1.0.0",
        },
    },
    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerYaml = yaml.stringify(swaggerSpec);
fs.writeFileSync('./swagger.yaml', swaggerYaml)

console.log("swagger.yaml gerado com sucesso.")