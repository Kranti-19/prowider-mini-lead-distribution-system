import Link from "next/link";

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">

      <h1 className="text-5xl font-bold">
        Prowider Mini Lead Distribution System
      </h1>

      <p className="text-lg text-gray-600">
        Full Stack Developer Assignment
      </p>

      <div className="flex gap-4">

        <Link
          href="/request-service"
          className="bg-black text-white px-5 py-3 rounded"
        >
          Request Service
        </Link>

        <Link
          href="/dashboard"
          className="bg-black text-white px-5 py-3 rounded"
        >
          Dashboard
        </Link>

        <Link
          href="/test-tools"
          className="bg-black text-white px-5 py-3 rounded"
        >
          Test Tools
        </Link>

      </div>

    </div>
  );
}