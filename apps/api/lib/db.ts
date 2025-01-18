import { PrismaClient } from "@prisma/client";


let db: PrismaClient | null = null;

if (process.env.NODE_ENV === "production") {
    db = new PrismaClient();
}

if (!db) {
    db = new PrismaClient();
}

export default db;