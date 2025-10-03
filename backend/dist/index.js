import Fastify from "fastify";
import cors from "@fastify/cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import fastifyCors from "@fastify/cors";
import { createRemoteJWKSet, jwtVerify } from "jose";
dotenv.config();
const server = Fastify({ logger: true });
const prisma = new PrismaClient();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
server.addHook("onRequest", async (req, reply) => {
    console.log("Incoming request:", {
        method: req.method,
        url: req.url,
        origin: req.headers.origin,
        headers: req.headers,
    });
});
// Global hook: applies to ALL routes
server.addHook("preHandler", verifyToken);
await server.register(cors, {
    origin: (origin, cb) => {
        console.log("CORS check for origin:", origin);
        cb(null, "https://main.d2np3paqtw76f.amplifyapp.com");
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});
// Cognito values
const region = "us-east-2";
const userPoolId = "us-east-2_5diebWcgj";
const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
// Create JWKS client
const JWKS = createRemoteJWKSet(new URL(jwksUrl));
// Middleware to check auth
async function verifyToken(req, reply) {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return reply.code(401).send({ error: "Missing Authorization header" });
        }
        const token = auth.replace("Bearer ", "");
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
        });
        // Attach decoded user info to request
        req.user = payload;
    }
    catch (err) {
        if (err instanceof Error) {
            req.log.error({ err }, "Auth failed");
        }
        else {
            req.log.error({ err }, "Auth failed");
        }
        return reply.code(401).send({ error: "Invalid or expired token" });
    }
}
// Route
server.get("/api/users", async (_request, reply) => {
    const result = await pool.query("SELECT * FROM users");
    return reply.send(result.rows);
});
// Upsert Customer
server.post("/api/customers", async (request, reply) => {
    try {
        const { id, name, email, phone } = request.body;
        const customer = await prisma.customer.upsert({
            where: { id: id ?? 0 },
            update: { name, email, phone: phone ?? null },
            create: { name, email, phone: phone ?? null },
        });
        return reply.code(200).send(customer);
    }
    catch (err) {
        server.log.error(err);
        return reply.code(400).send({ error: "Failed to upsert customer" });
    }
});
// Upsert Lead
server.post("/api/leads", async (request, reply) => {
    try {
        const { id, title, description, customerId, status } = request.body;
        const lead = await prisma.lead.upsert({
            where: { id: id ?? 0 },
            update: {
                title,
                description: description ?? null,
                status: status ?? "NEW",
            },
            create: {
                title,
                description: description ?? null,
                status: status ?? "NEW",
                customer: { connect: { id: customerId } },
            },
        });
        return reply.code(200).send(lead);
    }
    catch (err) {
        server.log.error(err);
        return reply.code(400).send({ error: "Failed to upsert lead" });
    }
});
const start = async () => {
    try {
        await server.listen({ port: Number(process.env.PORT) || 4000 });
        console.log(`🚀 Server running`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map