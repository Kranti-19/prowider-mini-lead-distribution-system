import { NextResponse } from "next/server";

export async function POST() {

  try {

    const promises = [];

    for (let i = 0; i < 10; i++) {

      const leadData = {
        name: `Test User ${i}`,
        phone: `900000000${i}`,
        city: "Pune",
        serviceId: (i % 3) + 1,
        description: "Concurrency Test",
      };

      const promise = fetch(
        "http://localhost:3000/api/leads/create",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            leadData
          ),
        }
      );

      promises.push(promise);
    }

    await Promise.all(promises);

    return NextResponse.json({
      success: true,
      message:
        "10 concurrent leads generated",
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