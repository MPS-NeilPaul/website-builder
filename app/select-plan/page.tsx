"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, Zap, Globe, Infinity, Loader2 } from "lucide-react";

const PLANS = [
  {
    id: "STARTER",
    name: "Starter",
    description: "Perfect for a single business or personal project.",
    price: "$19",
    billing: "/month",
    icon: Globe,
    features: [
      "1 AI-Powered Site",
      "Standard AI Content Generation",
      "5 GB Cloud Storage",
      "Custom Domain Support",
      "Community Support",
    ],
    isPopular: false,
  },
  {
    id: "PRO",
    name: "Professional",
    description: "Ideal for creators managing multiple brands.",
    price: "$49",
    billing: "/month",
    icon: Zap,
    features: [
      "Up to 3 AI-Powered Sites",
      "Advanced AI Tone Control",
      "15 GB Cloud Storage",
      "Priority Global CDN",
      "24/7 Email Support",
    ],
    isPopular: true,
  },
  {
    id: "ENTERPRISE",
    name: "Agency Scale",
    description: "Pay-as-you-go infrastructure that auto-scales.",
    price: "Custom",
    billing: " Metered",
    icon: Infinity,
    features: [
      "Unlimited Sites",
      "Auto-Scaling Resources",
      "Unrestricted AI Generation",
      "White-label Dashboard",
      "Dedicated Success Manager",
    ],
    isPopular: false,
  },
];

export default function SelectPlanPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>("PRO");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan to continue.");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      // WE EXTRACT THE ACTUAL BACKEND ERROR NOW
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save subscription plan");
      }
      
      toast.success("Plan selected! Redirecting to setup...");      
      // Force a hard navigation to clear the Next.js cache
      window.location.href = "/onboarding";
      
    } catch (error: any) {
      // NOW THE TOAST SHOWS THE REAL ERROR
      toast.error(error.message || "Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl transition-colors">
          Choose your foundation
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 transition-colors">
          Whether you are launching your first business or scaling an agency, we have an infrastructure plan designed for your growth.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const PlanIcon = plan.icon;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative flex flex-col rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? "bg-white dark:bg-gray-900 border-2 border-primary shadow-xl shadow-primary/10 scale-105 z-10" 
                  : "bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 hover:border-primary/50 hover:bg-white dark:hover:bg-gray-900"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                  isSelected ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                  <PlanIcon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 min-h-[40px] transition-colors">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6 flex items-baseline text-gray-900 dark:text-white transition-colors">
                <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">
                  {plan.billing}
                </span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className={`h-5 w-5 shrink-0 ${isSelected ? "text-primary" : "text-gray-400 dark:text-gray-600"} transition-colors`} />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className={`w-full py-3 px-4 rounded-xl text-center text-sm font-bold transition-all ${
                isSelected 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}>
                {isSelected ? "Selected" : "Select Plan"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="mt-16 flex flex-col items-center">
        <button
          onClick={handleContinue}
          disabled={isProcessing || !selectedPlan}
          className="group relative flex items-center justify-center gap-2 rounded-full bg-primary px-10 py-4 text-lg font-bold text-white hover:opacity-90 transition-all disabled:opacity-70 shadow-lg shadow-primary/30 w-full sm:w-auto min-w-[300px]"
        >
          {isProcessing ? (
            <Loader2 className="animate-spin h-6 w-6" />
          ) : (
            "Continue to AI Setup"
          )}
        </button>
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
          You can upgrade or downgrade your infrastructure at any time.
        </p>
      </div>

    </div>
  );
}