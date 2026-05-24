import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProvidersForLead } from "@/lib/allocation";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const {
      name,
      phone,
      city,
      serviceId,
      description,
    } = body;

    // validation
    if (
      !name ||
      !phone ||
      !city ||
      !serviceId ||
      !description
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // create lead
    // transaction for consistency
const result = await prisma.$transaction(
  async (tx) => {

    // create lead
    const lead = await tx.lead.create({
      data: {
        name,
        phone,
        city,
        serviceId,
        description,
      },
    });

    // get providers
    const providerIds =
      await getProvidersForLead(serviceId);

    // create assignments
    for (const providerId of providerIds) {

      await tx.leadAssignment.create({
        data: {
          leadId: lead.id,
          providerId,
        },
      });

      // increment provider quota usage
      await tx.provider.update({
        where: {
          id: providerId,
        },
        data: {
          leadsReceived: {
            increment: 1,
          },
        },
      });
    }

    return {
      lead,
      providerIds,
    };
  }
);

    return NextResponse.json({
  success: true,
  data: result,
});

  } catch (error: any) {

    console.log(error);

    // duplicate protection
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Duplicate lead for this service already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}