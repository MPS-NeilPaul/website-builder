import React from "react";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BuilderClient from "./BuilderClient";

export default async function BuilderPage({ params }: { params: { siteId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // 1. Securely fetch the site and all its pages
  const site = await prisma.site.findFirst({
    where: { 
      id: params.siteId,
      user: { email: session.user.email }
    },
    include: {
      pages: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!site) notFound();

  let pages = site.pages;

  // 2. Auto-provision a "Home" page if they literally have zero pages
  if (pages.length === 0) {
    const homePage = await prisma.page.create({
      data: {
        siteId: site.id,
        title: "Home",
        slug: "/",
        content: { elements: [] }, // Blank JSON tree for the canvas
        status: "DRAFT",
        aiSeoScore: 0,
      }
    });
    pages = [homePage];
  }

  // 3. Pass the real database data to our interactive Client Component
  return <BuilderClient siteId={site.id} siteName={site.name} initialPages={pages} />;
}