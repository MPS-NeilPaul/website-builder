import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LiveRenderer } from "@/app/dashboard/sites/[siteId]/builder/components/LiveRenderer";

export default async function TenantHomePage({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(params.domain);
  
  const isSubdomain = domain.endsWith(".localhost") || domain.endsWith(".nexus.com");
  let site;

  // 1. Resolve Site
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

  // 2. Resolve Page 
  // We check for the "/" slug specifically, but also "home" as a safe fallback
  let page = await prisma.page.findFirst({
    where: {
      siteId: site.id,
      slug: {
        in: ["/", "home", ""],
      },
    },
  });

  // If we still can't find a page by slug, grab the first one ever created for this site
  if (!page) {
    page = await prisma.page.findFirst({
      where: { siteId: site.id },
      orderBy: { createdAt: "asc" },
    });
  }

  // Final 404 if the site has absolutely no pages
  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-12 border border-gray-100 rounded-3xl">
          <h1 className="text-3xl font-black text-gray-900 mb-2">{site.name}</h1>
          <p className="text-gray-500">Site is live, but no content has been published.</p>
        </div>
      </div>
    );
  }

  // 3. Extract JSON elements from the page record
  const content = (page.content as any) || { elements: [] };
  const elements = content.elements || [];

  return (
    <main className="min-h-screen bg-white">
      <LiveRenderer elements={elements} />
    </main>
  );
}