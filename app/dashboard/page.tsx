import React from "react";
import { Sparkles, TrendingUp, MousePointer2, ExternalLink } from "lucide-react";

// Robust, reusable Card components built with Tailwind
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl border bg-white shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 border-b border-gray-50 bg-gray-50/30">
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <h3 className={`font-bold text-gray-800 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Command Center</h2>
          <p className="text-gray-500 mt-1">Real-time overview of your site ecosystem.</p>
        </div>
      </div>

      {/* AI Productivity & Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* AI Insight Card */}
        <Card className="border-blue-100 ring-1 ring-blue-50">
          <CardContent className="bg-gradient-to-br from-blue-50/50 to-white h-full">
            <div className="flex items-center gap-2 text-blue-600 mb-3">
              <Sparkles className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              Your site <span className="font-semibold text-blue-700">"Bakery"</span> is trending on mobile. 
              Conversion could increase by <strong>12%</strong> if you enable the AI-Optimized Sticky Header.
            </p>
            <button className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
              Apply Optimization
            </button>
          </CardContent>
        </Card>

        {/* Total Visits Metric */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-medium">Total Global Visits</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">24,812</p>
            </div>
          </CardContent>
        </Card>

        {/* Avg Conversion Metric */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <MousePointer2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">-0.8%</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-medium">Avg. Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">3.18%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sites Snapshot Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Tenants</CardTitle>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all sites <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </CardHeader>
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <p className="text-sm text-gray-500">Connecting to Google Cloud SQL...</p>
        </div>
      </Card>
    </div>
  );
}