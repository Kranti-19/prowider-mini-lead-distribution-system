import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // SERVICES
  await prisma.service.createMany({
    data: [
      { name: "Service 1" },
      { name: "Service 2" },
      { name: "Service 3" },
    ],
    skipDuplicates: true,
  });

  // PROVIDERS
  await prisma.provider.createMany({
    data: [
      { name: "Provider 1" },
      { name: "Provider 2" },
      { name: "Provider 3" },
      { name: "Provider 4" },
      { name: "Provider 5" },
      { name: "Provider 6" },
      { name: "Provider 7" },
      { name: "Provider 8" },
    ],
    skipDuplicates: true,
  });

  // ALLOCATION STATE
  const allocationState = await prisma.allocationState.findFirst();

  if (!allocationState) {
    await prisma.allocationState.create({
      data: {
        service1Index: 0,
        service2Index: 0,
        service3Index: 0,
      },
    });
  }

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });