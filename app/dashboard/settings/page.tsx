"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  Palette, Save, Bot, Sparkles, Loader2, LogOut, RefreshCcw, HardDrive, ShieldCheck,
  Server, Database, Activity 
} from "lucide-react";

const THEMES = [
  { name: "Blue", hex: "#2563eb", bgClass: "bg-blue-600" },
  { name: "Green", hex: "#16a34a", bgClass: "bg-green-600" },
  { name: "Purple", hex: "#9333ea", bgClass: "bg-purple-600" },
  { name: "Rose", hex: "#e11d48", bgClass: "bg-rose-600" },
  { name: "Orange", hex: "#ea580c", bgClass: "bg-orange-600" },
  { name: "Slate", hex: "#475569", bgClass: "bg-slate-600" },
];

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden transition-colors">
    {children}
  </div>
);

const CardHeader = ({ title, icon: Icon, description }: { title: string, icon: any, description: string }) => (
  <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 transition-colors">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="h-5 w-5 text-primary transition-colors" />
      <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // User Preferences State
  const [activeColor, setActiveColor] = useState(THEMES[0].hex);
  const [aiTone, setAiTone] = useState("professional");
  
  // Dynamic Resource & Infrastructure State
  const [storage, setStorage] = useState({ used: 0, limit: 500 });
  const [gcpHealth, setGcpHealth] = useState({ sqlSizeMB: 0, cloudRunStatus: "Loading...", activeInstances: 0, errorRate: "0%" });
  
  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.theme) setActiveColor(data.theme);
        if (data.aiTone) setAiTone(data.aiTone);
        if (data.storage) setStorage(data.storage);
        if (data.gcpHealth) setGcpHealth(data.gcpHealth);
      })
      .catch((err) => console.error("Failed to load settings", err));
  }, []);

  const handleColorChange = (hex: string) => {
    setActiveColor(hex);
    document.documentElement.style.setProperty("--primary", hex);
    toast.success(`Theme preview: ${THEMES.find(t => t.hex === hex)?.name}`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const savePromise = fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: activeColor, aiTone: aiTone }),
    }).then(async (res) => {
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    });

    await toast.promise(savePromise, {
      loading: 'Saving configuration...',
      success: 'Workspace settings permanently saved!',
      error: 'Failed to save settings.',
    });

    router.refresh(); 
    setIsSaving(false);
  };

  const handleClearCache = async () => {
    setIsClearingCache(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
      router.refresh();
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Workspace cache successfully cleared!");
    } catch (error) {
      toast.error("Failed to clear system cache.");
    } finally {
      setIsClearingCache(false);
    }
  };

  // Calculate dynamic progress bar width
  const storagePercentage = Math.min((storage.used / storage.limit) * 100, 100);

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
          Settings
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">
          Manage your workspace preferences, system performance, and AI generation engine.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Settings */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader title="Workspace Appearance" icon={Palette} description="Customize the primary color of your dashboard." />
            <div className="p-6 space-y-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Theme Color</label>
              <div className="flex flex-wrap gap-4">
                {THEMES.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => handleColorChange(theme.hex)}
                    className={`group relative flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 transition-all ${
                      activeColor === theme.hex ? "border-gray-900 dark:border-white scale-110 shadow-md" : "border-transparent hover:scale-105"
                    }`}
                    title={theme.name}
                  >
                    <span className={`h-10 w-10 rounded-full shadow-inner ${theme.bgClass}`} />
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="AI Generation Engine" icon={Bot} description="Control how the AI writes and optimizes your websites." />
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Default Content Tone</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors sm:text-sm"
                >
                  <option value="professional">Professional & Corporate</option>
                  <option value="conversational">Friendly & Conversational</option>
                  <option value="persuasive">Persuasive (Sales Optimized)</option>
                  <option value="creative">Bold & Creative</option>
                </select>
              </div>
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Auto-Optimization Enabled</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    The AI will continuously analyze your published sites in the background and suggest SEO improvements on your Command Center.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-md shadow-primary/20 disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>

        {/* System & Account Tools */}
        <div className="space-y-8">
          <Card>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <HardDrive className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Storage Quota</h3>
              </div>
            </div>
            <div className="p-5 space-y-3 bg-gray-50/30 dark:bg-gray-800/30">
              <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                <span>{storage.used.toFixed(1)} MB Used</span>
                <span>{storage.limit} MB Limit</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${storagePercentage}%` }} 
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Infrastructure Health</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Database className="h-4 w-4" />
                  <span>Cloud SQL Size</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{gcpHealth.sqlSizeMB} MB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Server className="h-4 w-4" />
                  <span>Cloud Run Status</span>
                </div>
                <span className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-gray-100">
                  <span className={`h-2 w-2 rounded-full ${gcpHealth.cloudRunStatus === 'Healthy' ? 'bg-green-500' : 'bg-orange-500'}`} />
                  {gcpHealth.cloudRunStatus}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Activity className="h-4 w-4" />
                  <span>Avg Error Rate</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{gcpHealth.errorRate}</span>
              </div>
              
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <button onClick={handleClearCache} disabled={isClearingCache} className="w-full flex items-center justify-center gap-2 mt-2 p-2 rounded-lg text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors disabled:opacity-50">
                  <RefreshCcw className={`h-4 w-4 ${isClearingCache ? "animate-spin" : ""}`} />
                  <span className="font-medium">Clear Workspace Cache</span>
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Account Security</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1 truncate">Logged in as: {session?.user?.email}</p>
            </div>
            <div className="p-4 bg-gray-50/30 dark:bg-gray-800/30">
              <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                <LogOut className="h-4 w-4" />
                Sign Out Securely
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}