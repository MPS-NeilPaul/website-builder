"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { CreateSiteModal } from "@/components/CreateSiteModal";

export function SitesHeader({ isEmpty }: { isEmpty: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">
            My Sites
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">
            Manage your AI-powered web properties and domains.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
        >
          <PlusCircle className="h-4 w-4" />
          {isEmpty ? "Generate First Site" : "Create New Site"}
        </button>
      </div>

      <CreateSiteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}