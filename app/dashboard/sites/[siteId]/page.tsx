import React from "react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  ExternalLink, 
  LayoutTemplate, 
  Sparkles, 
  Settings, 
  Activity, 
  Plus,
  FileText,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default async function SiteCommandCenter({ params }: { params: { siteId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // 1. SECURE FETCH: Ensure the site belongs to the logged-in user
  const site = await prisma.site.findFirst({
    where: { 
      id: params.siteId,
      user: { email: session.user.email }
    },
    include: {
      pages: {
        orderBy: { updatedAt: "desc" }
      },
      metricsSnapshot: {
        orderBy: { date: "desc" },
        take: 1
      }
    }
  });

  if (!site) notFound();

  const isDev = process.env.NODE_ENV === "development";
  const platformDomain = isDev ? "localhost:3000" : "nexus.com";
  const protocol = isDev ? "http" : "https";
  const liveUrl = site.customDomain 
    ? `https://${site.customDomain}` 
    : `${protocol}://${site.subdomain}.${platformDomain}`;

  // Calculate average AI SEO Score
  const avgSeoScore = site.pages.length > 0 
    ? Math.round(site.pages.reduce((acc, page) => acc + page.aiSeoScore, 0) / site.pages.length)
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {site.name}
            <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
              Live Edge Node
            </span>
          </h1>
          <a 
            href={liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1.5 mt-1 text-sm font-medium"
          >
            {liveUrl.replace(/^https?:\/\//, '')} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href={`/dashboard/sites/${site.id}/settings`}
            className="p-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <Link 
            href={`/dashboard/sites/${site.id}/builder`}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
          >
            <LayoutTemplate className="h-4 w-4" />
            Open Canvas
          </Link>
        </div>
      </div>

      {/* AI Health & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pages</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{site.pages.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall AI SEO Score</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgSeoScore}/100</p>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${avgSeoScore > 80 ? 'bg-green-500' : avgSeoScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${avgSeoScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">30-Day Traffic</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {site.metricsSnapshot[0]?.uniqueUsers || "---"}
            </p>
          </div>
        </div>
      </div>

      {/* Pages Management Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-gray-400" />
            Page Hierarchy
          </h2>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm shadow-purple-600/20">
              <Sparkles className="h-4 w-4" />
              Auto-Generate Page
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Plus className="h-4 w-4" />
              Blank Page
            </button>
          </div>
        </div>

        {site.pages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No pages deployed yet</h3>
            <p className="text-gray-500 max-w-sm mb-6">
              Use the Generative AI engine to instantly build a high-converting landing page, or start from a blank canvas.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity">
              <Sparkles className="h-5 w-5" />
              Generate First Page
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-4 rounded-tl-lg">Page Name</th>
                  <th scope="col" className="px-6 py-4">Path</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">AI SEO Score</th>
                  <th scope="col" className="px-6 py-4 text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {site.pages.map((page) => (
                  <tr key={page.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {page.title}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {page.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        page.status === 'PUBLISHED' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${page.aiSeoScore >= 80 ? 'text-green-500' : page.aiSeoScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {page.aiSeoScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary font-medium hover:underline">
                        Open Editor
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}