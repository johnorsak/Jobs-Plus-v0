import Fastify from "fastify";
import cors from "@fastify/cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import fastifyCors from "@fastify/cors";
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
await server.register(cors, {
    origin: (origin, cb) => {
        console.log("CORS check for origin:", origin);
        cb(null, "https://main.d2np3paqtw76f.amplifyapp.com");
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});
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