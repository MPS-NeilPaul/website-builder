import { notFound } from "next/navigation";
import prisma from "@/lib/prisma"; // Your new singleton

export default async function SiteRenderer({
  params,
}: {
  params: { domain: string };
}) {
  const { domain } = params;

  // Clean the domain for local testing (removes the port and localhost)
  // e.g., "bakery.localhost%3A3000" becomes "bakery"
  const cleanSubdomain = domain
    .replace("%3A", ":")
    .split(":")[0]
    .replace(".localhost", "");

  // Fetch the site from your Google Cloud PostgreSQL database
  const site = await prisma.site.findFirst({
    where: {
      OR: [
        { subdomain: cleanSubdomain }, 
        { customDomain: domain }
      ],
    },
  });

  // If the domain doesn't exist in your database, throw a 404 error
  if (!site) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to {site.name}
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        This is a live tenant site served from the Multi-Tenant Engine.
      </p>
    </main>
  );
}