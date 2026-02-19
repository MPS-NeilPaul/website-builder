"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Sparkles, Building2, Globe, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: "",
    niche: "technology",
    subdomain: "",
  });

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, subdomain: formatted });
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.subdomain) {
      toast.error("Please complete all required fields.");
      return;
    }

    setIsDeploying(true);

    try {
      // Calls the same /api/sites endpoint we built earlier!
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.businessName,
          subdomain: formData.subdomain,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to initialize site");

      toast.success("AI Tenant deployed successfully!");      
      // Force a hard navigation so the Dashboard Layout pulls fresh DB data
      window.location.href = "/dashboard";

    } catch (error: any) {
      toast.error(error.message);
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">
          Initialize your tenant
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Our AI needs a few details to generate your optimized workspace.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow-xl shadow-primary/5 sm:rounded-2xl sm:px-10 border border-gray-200 dark:border-gray-800 transition-colors">
          <form onSubmit={handleDeploy} className="space-y-6">
            
            {/* Step 1: Business Details */}
            <div className={`space-y-6 transition-opacity duration-300 ${step === 1 ? "opacity-100" : "hidden"}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Business or Project Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-primary focus:border-primary py-2.5 transition-colors"
                    placeholder="Acme Innovations"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Primary Industry
                </label>
                <select
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg transition-colors"
                >
                  <option value="technology">Technology & SaaS</option>
                  <option value="ecommerce">E-Commerce & Retail</option>
                  <option value="agency">Creative Agency</option>
                  <option value="local">Local Service Business</option>
                  <option value="portfolio">Personal Portfolio</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.businessName}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Step 2: Technical Provisioning */}
            <div className={`space-y-6 transition-opacity duration-300 ${step === 2 ? "opacity-100" : "hidden"}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assign Subdomain
                </label>
                <p className="text-xs text-gray-500 mb-3">You can connect a custom domain later from your dashboard.</p>
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-colors">
                  <div className="pl-3 py-2.5 flex items-center bg-white dark:bg-gray-800">
                    <Globe className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.subdomain}
                    onChange={handleSubdomainChange}
                    placeholder="acme-corp"
                    className="w-full bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
                  />
                  {/* DYNAMIC SUFFIX FOR LOCAL DEV */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 px-3 py-2.5 border-l border-gray-300 dark:border-gray-700 flex items-center text-sm text-gray-500 whitespace-nowrap">
                    {process.env.NODE_ENV === "development" ? ".localhost:3000" : ".your-production-url.com"}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 px-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isDeploying || !formData.subdomain}
                  className="w-2/3 flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-md shadow-primary/20 text-sm font-medium text-white bg-primary hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isDeploying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isDeploying ? "Provisioning Engine..." : "Deploy Tenant"}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}