"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X, Loader2, Sparkles, Globe } from "lucide-react";

export function CreateSiteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
  });

  // Automatically format the subdomain to be URL-safe (lowercase, no spaces)
  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, subdomain: formatted });
  };

  // Simulates an AI generating a site concept based on current trends
  const handleAiSuggest = async () => {
    setIsGeneratingInfo(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate AI delay
    setFormData({
      name: "NextGen Bakery",
      subdomain: "nextgen-bakery",
    });
    toast.success("AI suggested a highly-converting niche!");
    setIsGeneratingInfo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subdomain) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create site");

      toast.success("AI Tenant created successfully!");
      onClose(); // Close the modal
      router.refresh(); // Refresh the Server Component grid to show the new site
      
      // Reset form
      setFormData({ name: "", subdomain: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Deploy New AI Site</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Initialize a new tenant in your ecosystem.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* AI Assist Button */}
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={isGeneratingInfo}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-semibold border border-primary/20"
          >
            {isGeneratingInfo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {isGeneratingInfo ? "Analyzing trends..." : "Auto-Generate with AI"}
          </button>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Acme Corporation"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subdomain
              </label>
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-colors">
                <input
                  type="text"
                  value={formData.subdomain}
                  onChange={handleSubdomainChange}
                  placeholder="acme-corp"
                  className="w-full bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
                />
                <div className="bg-gray-50 dark:bg-gray-800/50 px-3 py-2.5 border-l border-gray-300 dark:border-gray-700 flex items-center text-sm text-gray-500">
                  .royaltybuilder.com
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-70 shadow-md shadow-primary/20"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
              {isSubmitting ? "Deploying..." : "Deploy Site"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}