import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sparkles, TrendingUp, MousePointer2, ExternalLink } from "lucide-react";

// Robust, reusable Card components updated for Dark Mode
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden transition-colors ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 transition-colors">
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`font-bold text-gray-800 dark:text-gray-100 transition-colors ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export default async function OverviewPage() {
  // Fetch user session for personalized greeting
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(" ")[0] || "Builder";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
            Welcome back, {firstName}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">
            Real-time overview of your site ecosystem.
          </p>
        </div>
      </div>

      {/* AI Productivity & Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* AI Insight Card - Using Dynamic 'primary' variables */}
        <Card className="border-primary/20 ring-1 ring-primary/10">
          <CardContent className="bg-gradient-to-br from-primary/5 to-transparent h-full">
            <div className="flex items-center gap-2 text-primary mb-3">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 transition-colors">
              Your site <span className="font-semibold text-primary">"Bakery"</span> is trending on mobile. 
              Conversion could increase by <strong className="dark:text-white">12%</strong> if you enable the AI-Optimized Sticky Header.
            </p>
            <button className="mt-5 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity shadow-md shadow-primary/20">
              Apply Optimization
            </button>
          </CardContent>
        </Card>

        {/* Total Visits Metric */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30 px-2 py-1 rounded-full transition-colors">
                +12.5%
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">Total Global Visits</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">24,812</p>
            </div>
          </CardContent>
        </Card>

        {/* Avg Conversion Metric */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
                <MousePointer2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/30 px-2 py-1 rounded-full transition-colors">
                -0.8%
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors">Avg. Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">3.18%</p>
            </div>
          </CardContent>
        </Card> 
      </div>

      {/* Sites Snapshot Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Tenants</CardTitle>
            <button className="text-xs font-medium text-primary hover:opacity-80 flex items-center gap-1 transition-opacity">
              View all sites <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </CardHeader>
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4 transition-colors">
             <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Connecting to Google Cloud SQL...</p>
        </div>
      </Card>
    </div>
  );
}