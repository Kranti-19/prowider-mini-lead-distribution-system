"use client";

export default function TestToolsPage() {

  async function resetQuota() {

    await fetch(
      "/api/test/reset-quota",
      {
        method: "POST",
      }
    );

    alert("Quota reset!");
  }

  async function testWebhook() {

    const eventId =
      "payment_" + Date.now();

    const response = await fetch(
      "/api/test/webhook",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          eventId,
        }),
      }
    );

    const data =
      await response.json();

    alert(data.message);
  }

  async function generateLeads() {

    await fetch(
      "/api/test/generate-leads",
      {
        method: "POST",
      }
    );

    alert(
      "10 leads generated!"
    );
  }

  return (
    <div className="min-h-screen p-10">

      <h1 className="text-3xl font-bold mb-8">
        Test Tools
      </h1>

      <div className="space-y-4">

        <button
          onClick={resetQuota}
          className="bg-black text-white px-5 py-3 rounded"
        >
          Reset Provider Quota
        </button>

        <br />

        <button
          onClick={testWebhook}
          className="bg-black text-white px-5 py-3 rounded"
        >
          Test Webhook
        </button>

        <br />

        <button
          onClick={generateLeads}
          className="bg-black text-white px-5 py-3 rounded"
        >
          Generate 10 Leads
        </button>

      </div>

    </div>
  );
}