import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { eventId } = body;

    if (!eventId) {

      return NextResponse.json(
        {
          success: false,
          message: "eventId required",
        },
        {
          status: 400,
        }
      );
    }

    // check existing event
    const existingEvent =
      await prisma.webhookEvent.findUnique({
        where: {
          eventId,
        },
      });

    // idempotency protection
    if (existingEvent) {

      return NextResponse.json({
        success: true,
        message:
          "Webhook already processed",
      });
    }

    // reset quotas
    await prisma.provider.updateMany({
      data: {
        monthlyQuota: 10,
        leadsReceived: 0,
      },
    });

    // save processed event
    await prisma.webhookEvent.create({
      data: {
        eventId,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Webhook processed successfully",
    });

  } catch (error) {

    console.log(error);

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