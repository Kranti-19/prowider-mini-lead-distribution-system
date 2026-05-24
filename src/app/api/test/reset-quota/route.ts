import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {

  try {

    await prisma.provider.updateMany({
      data: {
        monthlyQuota: 10,
        leadsReceived: 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Quotas reset",
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}