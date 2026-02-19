"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        {/* Global Notification System */}
        <Toaster 
          position="top-right"
          toastOptions={{
            // Premium styling that adapts to dark/light mode automatically
            className: "border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg rounded-xl text-sm font-medium",
            duration: 4000,
            success: {
              iconTheme: {
                primary: "#16a34a", // Tailwind green-600
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#e11d48", // Tailwind rose-600
                secondary: "#ffffff",
              },
            },
          }} 
        />
      </ThemeProvider>
    </SessionProvider>
  );
}