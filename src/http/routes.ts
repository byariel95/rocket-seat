import { FastifyInstance } from "fastify";
import { register } from "./controllers/registrer.controller";
import { authenticate } from "./controllers/authenticate.controller";

export async function appRoutes (app:FastifyInstance) {
    app.post('/users',register)
    app.post('/session',authenticate)
}