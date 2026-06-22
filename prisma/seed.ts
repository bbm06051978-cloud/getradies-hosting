import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("password123", 10);

  const homeowner = await prisma.user.upsert({
    where: { email: "sarah@test.com" },
    update: {},
    create: {
      name: "Sarah Johnson",
      email: "sarah@test.com",
      passwordHash: hash,
      role: "HOMEOWNER",
    },
  });

  const tradie = await prisma.user.upsert({
    where: { email: "john@test.com" },
    update: {},
    create: {
      name: "John Smith",
      email: "john@test.com",
      passwordHash: hash,
      role: "TRADIE",
    },
  });

  console.log("Created homeowner:", homeowner.email);
  console.log("Created tradie:", tradie.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());