import Fastify from "fastify";
import cors from "@fastify/cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const server = Fastify({ logger: true });
const prisma = new PrismaClient();

server.register(cors, { origin: true });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Notes

// Route
server.get("/api/users", async (_request, reply) => {
  const result = await pool.query("SELECT * FROM users");
  return reply.send(result.rows);
});

// Upsert Customer
server.post<{
  Body: { id?: number; name: string; email: string; phone?: string };
}>("/api/customers", async (request, reply) => {
  try {
    const { id, name, email, phone } = request.body;
    const customer = await prisma.customer.upsert({
      where: { id: id ?? 0 },
      update: { name, email, phone: phone ?? null },
      create: { name, email, phone: phone ?? null },
    });
    return reply.code(200).send(customer);
  } catch (err) {
    server.log.error(err);
    return reply.code(400).send({ error: "Failed to upsert customer" });
  }
});

// Upsert Lead
server.post<{
  Body: {
    id?: number;
    title: string;
    description?: string;
    customerId: number;
    status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "WON";
  };
}>("/api/leads", async (request, reply) => {
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
  } catch (err) {
    server.log.error(err);
    return reply.code(400).send({ error: "Failed to upsert lead" });
  }
});

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT) || 4000 });
    console.log(`🚀 Server running`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
