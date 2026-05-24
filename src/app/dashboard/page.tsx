"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {

  const [providers, setProviders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function fetchDashboard() {

    try {

      const response = await fetch(
        "/api/dashboard"
      );

      const data = await response.json();

      setProviders(data.providers);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    fetchDashboard();

    // auto refresh every 3 sec
    const interval = setInterval(() => {
      fetchDashboard();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-8">
        Provider Dashboard
      </h1>

      <div className="grid gap-6">

        {providers.map((provider) => (

          <div
            key={provider.id}
            className="border rounded-lg p-5"
          >

            <h2 className="text-xl font-semibold">
              {provider.name}
            </h2>

            <p>
              Leads Received:
              {" "}
              {provider.leadsReceived}
            </p>

            <p>
              Remaining Quota:
              {" "}
              {provider.remainingQuota}
            </p>

            <div className="mt-4">

              <h3 className="font-semibold mb-2">
                Assigned Leads
              </h3>

              <div className="space-y-2">

                {provider.assignedLeads.map(
                  (assignment: any) => (

                    <div
                      key={assignment.id}
                      className="border p-3 rounded"
                    >

                      <p>
                        Name:
                        {" "}
                        {
                          assignment.lead.name
                        }
                      </p>

                      <p>
                        Phone:
                        {" "}
                        {
                          assignment.lead.phone
                        }
                      </p>

                      <p>
                        Service:
                        {" "}
                        {
                          assignment.lead
                            .service.name
                        }
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}