import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin", 10);
  
  const existing = await prisma.user.findUnique({
    where: { email: "admin@getradie.com.au" },
  });

  if (existing) {
    console.log("Admin user already exists — updating password");
    await prisma.user.update({
      where: { email: "admin@getradie.com.au" },
      data: { passwordHash, role: "ADMIN" },
    });
  } else {
    await prisma.user.create({
      data: {
        email:        "admin@getradie.com.au",
        name:         "GeTradie Admin",
        passwordHash,
        role:         "ADMIN",
      },
    });
    console.log("Admin user created!");
  }

  console.log("Email:    admin@getradie.com.au");
  console.log("Password: admin");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
