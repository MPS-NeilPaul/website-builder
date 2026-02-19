import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch user preferences AND their dynamic subscription quotas
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        dashboardTheme: true, 
        aiTone: true,
        subscription: {
          select: {
            storageUsedMB: true,
            storageLimitMB: true,
            aiTokensUsed: true,
            aiTokenLimit: true,
          }
        }
      }
    });

    // 2. Infrastructure Telemetry (Prepped for Google Cloud SDK integration)
    // In production, you will replace these with actual calls to Cloud Monitoring API
    const gcpHealth = {
      sqlSizeMB: 1024.5,         // e.g., 1GB DB size
      cloudRunStatus: "Healthy", // "Healthy", "Degraded", "Failing"
      activeInstances: 3,        // Number of autoscaled containers
      errorRate: "0.01%"         // 5xx error rate from Cloud Load Balancing
    };

    return NextResponse.json({
      theme: user?.dashboardTheme || "#2563eb",
      aiTone: user?.aiTone || "professional",
      storage: {
        used: user?.subscription?.storageUsedMB || 0,
        limit: user?.subscription?.storageLimitMB || 500,
      },
      aiTokens: {
        used: user?.subscription?.aiTokensUsed || 0,
        limit: user?.subscription?.aiTokenLimit || 10000,
      },
      gcpHealth: gcpHealth
    }, { status: 200 });

  } catch (error) {
    console.error("Settings Fetch Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { theme, aiTone } = body;

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        dashboardTheme: theme,
        aiTone: aiTone,
      },
    });

    return NextResponse.json({ message: "Settings saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}