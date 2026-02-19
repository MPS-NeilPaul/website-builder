import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // Added to fetch the user's saved theme
import { ThemeToggle } from "@/components/ThemeToggle";
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
    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:bg-gray-800"
  >
    <Icon className="h-4 w-4" />
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 1. SECURE THE ROUTE: Fetch the user's session from the server
  const session = await getServerSession(authOptions);

  // 2. If they are not logged in, violently kick them back to the login page
  if (!session?.user) {
    redirect("/login");
  }

  // 3. FETCH SAVED USER PREFERENCES FROM THE DATABASE
  const userSettings = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { dashboardTheme: true, name: true, email: true }
  });

  // Default to our professional blue if the DB field is empty
  const activeTheme = userSettings?.dashboardTheme || "#2563eb";

  // Extract the first letter of their name or email for the avatar
  const initial = userSettings?.name 
    ? userSettings.name.charAt(0).toUpperCase() 
    : userSettings?.email?.charAt(0).toUpperCase() || "U";

  return (
    /* We inject the --primary variable directly into the style attribute here. 
       This ensures the custom color loads instantly on the server without flickering. */
    <div 
      className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]"
      style={{ "--primary": activeTheme } as React.CSSProperties}
    >
      {/* Sidebar */}
      <div className="hidden border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b border-gray-200 dark:border-gray-800 px-6">
            <Link className="flex items-center gap-2 font-bold text-lg text-primary" href="/">
              <Zap className="h-6 w-6 fill-current" />
              <span>Royalty Builder</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-4 text-sm font-medium gap-1">
              <SidebarItem icon={LayoutDashboard} label="Overview" href="/dashboard" />
              <SidebarItem icon={Globe} label="My Sites" href="/dashboard/sites" />
              <SidebarItem icon={BarChart3} label="AI Insights" href="/dashboard/analytics" />
              <div className="my-4 px-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                Management
              </div>
              <SidebarItem icon={Settings} label="Settings" href="/dashboard/settings" />
            </nav>
          </div>
          <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
            <button className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
              <PlusCircle className="h-4 w-4" />
              New AI Site
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50 px-6 lg:h-[60px]">
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg text-gray-900 dark:text-gray-100 transition-colors">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* The new Dark/Light Mode Toggle */}
            <ThemeToggle />
            
            {/* Dynamic User Avatar fetched from Prisma */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-purple-500 text-white font-bold text-sm shadow-sm transition-all">
              {initial}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-950 transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
}