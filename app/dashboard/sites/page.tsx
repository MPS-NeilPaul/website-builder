import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Globe, MoreVertical, ExternalLink, BarChart2, Sparkles } from "lucide-react";
import { SitesHeader } from "./SitesHeader";

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden transition-colors ${className}`}>
    {children}
  </div>
);

export default async function SitesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      sites: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  const sites = user?.sites || [];

  // DYNAMIC URL CONSTRUCTION
  const isDev = process.env.NODE_ENV === "development";
  const platformDomain = isDev ? "localhost:3000" : "nexus.com"; // Swap nexus.com with your actual live domain later
  const protocol = isDev ? "http" : "https";

  return (
    <div className="space-y-8">
      <SitesHeader isEmpty={sites.length === 0} />

      {sites.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-gray-50/50 dark:bg-gray-800/30">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No sites found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
            You haven't deployed any AI sites yet. Create your first tenant to start generating leads and traffic instantly.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => {
            // Determine the correct clickable URL based on environment
            const siteUrl = site.customDomain 
              ? `https://${site.customDomain}` 
              : `${protocol}://${site.subdomain}.${platformDomain}`;
            
            // Clean display string for the UI
            const displayUrl = site.customDomain || `${site.subdomain}.${platformDomain}`;

            return (
              <Card key={site.id} className="group hover:border-primary/50 transition-all duration-300">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[150px]">{site.name}</h3>
                      <a 
                        href={siteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1 mt-0.5"
                      >
                        <span className="truncate max-w-[150px]">{displayUrl}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-5 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Active
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                      <BarChart2 className="h-4 w-4" />
                      -- visits
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/sites/${site.id}`}
                    className="text-sm font-medium text-primary hover:opacity-80 transition-opacity"
                  >
                    Manage
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}