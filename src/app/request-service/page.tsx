"use client";

import { useState } from "react";

export default function RequestServicePage() {

  const [formData, setFormData] =
    useState({
      name: "",
      phone: "",
      city: "",
      serviceId: "1",
      description: "",
    });

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const response = await fetch(
        "/api/leads/create",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...formData,
            serviceId:
              Number(
                formData.serviceId
              ),
          }),
        }
      );

      const data =
        await response.json();

      if (data.success) {

        setMessage(
          "Lead submitted successfully!"
        );

        setFormData({
          name: "",
          phone: "",
          city: "",
          serviceId: "1",
          description: "",
        });

      } else {

        setMessage(data.message);
      }

    } catch (error) {

      console.log(error);

      setMessage(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-10">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg border rounded-lg p-8 space-y-5"
      >

        <h1 className="text-3xl font-bold">
          Request Service
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <select
          name="serviceId"
          value={formData.serviceId}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >

          <option value="1">
            Service 1
          </option>

          <option value="2">
            Service 2
          </option>

          <option value="3">
            Service 3
          </option>

        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          rows={4}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded"
        >

          {
            loading
              ? "Submitting..."
              : "Submit"
          }

        </button>

        {
          message && (
            <p className="text-center">
              {message}
            </p>
          )
        }

      </form>

    </div>
  );
}