import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    const providers =
      await prisma.provider.findMany({
        include: {
          assignments: {
            include: {
              lead: {
                include: {
                  service: true,
                },
              },
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      });

    const formattedProviders =
      providers.map((provider) => ({
        id: provider.id,
        name: provider.name,

        monthlyQuota:
          provider.monthlyQuota,

        leadsReceived:
          provider.leadsReceived,

        remainingQuota:
          provider.monthlyQuota -
          provider.leadsReceived,

        assignedLeads:
          provider.assignments,
      }));

    return NextResponse.json({
      success: true,
      providers: formattedProviders,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}