import { prisma } from "./prisma";

export async function getProvidersForLead(
  serviceId: number
) {

  // SERVICE CONFIG
  const config: Record<
    number,
    {
      mandatory: number[];
      pool: number[];
      allocationKey:
        | "service1Index"
        | "service2Index"
        | "service3Index";
    }
  > = {
    1: {
      mandatory: [1],
      pool: [2, 3, 4],
      allocationKey: "service1Index",
    },

    2: {
      mandatory: [5],
      pool: [6, 7, 8],
      allocationKey: "service2Index",
    },

    3: {
      mandatory: [1, 4],
      pool: [2, 3, 5, 6, 7, 8],
      allocationKey: "service3Index",
    },
  };

  const serviceConfig = config[serviceId];

  if (!serviceConfig) {
    throw new Error("Invalid service");
  }

  const selectedProviders: number[] = [];

// validate mandatory providers
for (const mandatoryProviderId of serviceConfig.mandatory) {

  const provider =
    await prisma.provider.findUnique({
      where: {
        id: mandatoryProviderId,
      },
    });

  if (!provider) {
    continue;
  }

  // check quota
  if (
    provider.leadsReceived >=
    provider.monthlyQuota
  ) {
    continue;
  }

  selectedProviders.push(
    mandatoryProviderId
  );
}

  // total providers needed
  const remainingSlots =
    3 - selectedProviders.length;

  // allocation state
  const allocationState =
    await prisma.allocationState.findFirst();

  if (!allocationState) {
    throw new Error("Allocation state missing");
  }

  const currentIndex =
    allocationState[
      serviceConfig.allocationKey
    ];

  // fair rotation
  const pool = serviceConfig.pool;

  for (let i = 0; i < pool.length; i++) {

    const providerId =
      pool[(currentIndex + i) % pool.length];

    // avoid duplicates
    if (selectedProviders.includes(providerId)) {
      continue;
    }

    // check quota
    const provider =
      await prisma.provider.findUnique({
        where: {
          id: providerId,
        },
      });

    if (!provider) {
      continue;
    }

    if (
      provider.leadsReceived >=
      provider.monthlyQuota
    ) {
      continue;
    }

    selectedProviders.push(providerId);

    if (
      selectedProviders.length === 3
    ) {
      break;
    }
  }

  // ensure exactly 3 providers
  if (selectedProviders.length < 3) {
    throw new Error(
      "Not enough providers available"
    );
  }

  // update rotation index
  await prisma.allocationState.update({
    where: {
      id: 1,
    },
    data: {
      [serviceConfig.allocationKey]:
        currentIndex + 1,
    },
  });

  return selectedProviders;
}