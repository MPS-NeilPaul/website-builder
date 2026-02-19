import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Globe, 
  Settings, 
  Zap, 
  BarChart3, 
  PlusCircle 
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => (
  <Link 
    href={href} 
    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50"
  >
    <Icon className="h-4 w-4" />
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-bold text-lg text-blue-600" href="/">
              <Zap className="h-6 w-6" />
              <span>Royalty Builder</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-4 text-sm font-medium">
              <SidebarItem icon={LayoutDashboard} label="Overview" href="/dashboard" />
              <SidebarItem icon={Globe} label="My Sites" href="/dashboard/sites" />
              <SidebarItem icon={BarChart3} label="AI Insights" href="/dashboard/analytics" />
              <div className="my-4 px-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                Management
              </div>
              <SidebarItem icon={Settings} label="Settings" href="/dashboard/settings" />
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              <PlusCircle className="h-4 w-4" />
              New AI Site
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white" />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}