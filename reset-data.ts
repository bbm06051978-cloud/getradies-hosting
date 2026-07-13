import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Deleting transactional data...");
  
  // Delete in correct order to avoid foreign key errors
  await prisma.notification.deleteMany({});
  console.log("✅ Notifications deleted");
  
  await prisma.message.deleteMany({});
  console.log("✅ Messages deleted");
  
  await prisma.payment.deleteMany({});
  console.log("✅ Payments deleted");
  
  await prisma.review.deleteMany({});
  console.log("✅ Reviews deleted");
  
  await prisma.booking.deleteMany({});
  console.log("✅ Bookings deleted");
  
  await prisma.quote.deleteMany({});
  console.log("✅ Quotes deleted");
  
  await prisma.job.deleteMany({});
  console.log("✅ Jobs deleted");
  
  console.log("✅ All transactional data cleared. Users and profiles kept.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());