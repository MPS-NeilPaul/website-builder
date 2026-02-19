import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Zap, Shield, Sparkles, ArrowRight, LayoutTemplate, Cpu, Layers } from "lucide-react";

export default async function LandingPage() {
  // DYNAMIC AUTH CHECK: Determines what buttons the user sees
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      {/* Premium Navigation */}
      <nav className="flex items-center justify-between px-6 py-5 sm:px-12 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#0a0a0a]/80">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
          <Zap className="h-6 w-6 text-blue-500 fill-blue-500" />
          <span>ApexBuilder</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                href="/dashboard" 
                className="px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-32 pb-20 sm:px-12 text-center max-w-5xl mx-auto flex flex-col items-center">
          {/* Glowing Background Effect */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            The Ultimate Agency Platform
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] uppercase">
            DEPLOY HIGH PERFORMANCE <br className="hidden sm:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">WEB PLATFORMS</span> AT SCALE.
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
            Leave outdated slow builders & websites behind. Provision lightning-fast, AI-optimized sites on enterprise-grade infrastructure that auto scales. Built for modern business's & primarily optimised for SEO.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 hover:scale-105 transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)]"
            >
              Start Building Now <ArrowRight className="h-5 w-5" />
            </Link>
            <Link 
              href="#features" 
              className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10"
            >
              Explore Infrastructure
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="px-6 py-32 sm:px-12 bg-black relative border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">Engineered for dominance.</h2>
              <p className="text-gray-400 text-lg">Everything you need to run a high-performance web agency out of the box.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-8 bg-[#111] rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors group">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-white">Agency Multi-Tenancy</h3>
                <p className="text-gray-400 leading-relaxed">Manage infinite client subdomains and custom domains from a single, unified command center.</p>
              </div>

              <div className="p-8 bg-[#111] rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-colors group">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-white">Native Generative AI</h3>
                <p className="text-gray-400 leading-relaxed">Our integrated LLMs generate highly-converting copy, optimize SEO, and structure your pages automatically.</p>
              </div>

              <div className="p-8 bg-[#111] rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-white">Edge-Optimized Security</h3>
                <p className="text-gray-400 leading-relaxed">Built on Google Cloud with strict database isolation, instant SSL provisioning, and global CDN routing.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-300">
            <Zap className="h-5 w-5 text-blue-500 fill-blue-500" />
            <span>ApexBuilder</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 ApexBuilder Solutions. Next-Gen Architecture.
          </p>
        </div>
      </footer>
    </div>
  );
}