import React from "react";
import Link from "next/link";
import { Zap, Shield, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <Zap className="fill-current" />
          <span>Royalty Builder</span>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/dashboard" 
            className="px-5 py-2 rounded-full font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/dashboard" 
            className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200"
          >
            Go to Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-8 py-24 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="h-3 w-3" />
            Next-Gen AI Website Builder
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900">
            Build sites that think, <br /> learn, and sell for you.
          </h1>
          <p className="text-xl text-gray-500 mb-10 leading-relaxed">
            The world's first multi-tenant engine with integrated AI insights. 
            Deploy infinite professional sites on a rock-solid infrastructure in seconds.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all">
              Start Building Free <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="px-8 py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Instant Multi-Tenancy</h3>
              <p className="text-gray-500 text-sm">Spin up new subdomains or custom domains instantly with our high-speed routing engine.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Optimization</h3>
              <p className="text-gray-500 text-sm">Automated SEO, image compression, and content generation powered by advanced LLMs.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">Enterprise Security</h3>
              <p className="text-gray-500 text-sm">Google Cloud SQL backends with enforced SSL encryption and isolated tenant data.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 px-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        © 2026 Royalty Solutions. Built with Next.js & Prisma.
      </footer>
    </div>
  );
}