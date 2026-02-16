import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import './database/config.js';

import authRoute from './routes/authRoute.js';
import clienteRoute from './routes/clienteRoute.js';
import kpiRoute from './routes/kpiRoute.js';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';


const app = express();


app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API de cadastro de clientes",
            version: "1.0.0",
            description: "Documentação da API do clientHub",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            }
        ]
    },

    apis: ["./src/routes/*.js"],
}

const specs = swaggerJSDoc(options)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/", authRoute)
app.use("/usuario", clienteRoute)
app.use("/dashboard", kpiRoute)


if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


app.get("/", (req, res) => {
    res.send("Hello world!");
})


export default app;