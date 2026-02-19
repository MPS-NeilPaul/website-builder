import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma"; 
import { LiveRenderer } from "@/app/dashboard/sites/[siteId]/builder/components/LiveRenderer";

export default async function TenantPage({ 
  params 
}: { 
  params: { domain: string; slug?: string } 
}) {
  const domain = decodeURIComponent(params.domain);
  const slug = params.slug || "home"; // Defaults to home if no slug is provided
  
  const isSubdomain = domain.endsWith(".localhost") || domain.endsWith(".nexus.com");
  let site;

  // 1. Find the Site
  if (isSubdomain) {
    const subdomain = domain.split(".")[0]; 
    site = await prisma.site.findUnique({
      where: { subdomain: subdomain },
    });
  } else {
    site = await prisma.site.findUnique({
      where: { customDomain: domain },
    });
  }

  if (!site) notFound();

  // 2. Find the specific Page
  const page = await prisma.page.findFirst({
    where: {
      siteId: site.id,
      slug: slug, 
    },
  });

  if (!page) notFound();

  // 3. Render
  const content = (page.content as any) || { elements: [] };
  const elements = content.elements || [];

  return (
    <main className="min-h-screen bg-white">
      <LiveRenderer elements={elements} />
    </main>
  );
}