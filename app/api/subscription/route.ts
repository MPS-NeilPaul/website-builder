import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();

    // Dynamically assign resources based on the selected tier
    let siteLimit = 1;
    let storageLimitMB = 5000; // 5 GB
    let aiTokenLimit = 10000;

    if (planId === "PRO") {
      siteLimit = 3;
      storageLimitMB = 15000; // 15 GB
      aiTokenLimit = 50000;
    } else if (planId === "ENTERPRISE") {
      siteLimit = 999999; // Unlimited
      storageLimitMB = 999999;
      aiTokenLimit = 999999;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Upsert ensures we update the subscription if it exists, or create it if it doesn't
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        tier: planId,
        siteLimit: siteLimit,
        storageLimitMB: storageLimitMB,
        aiTokenLimit: aiTokenLimit,
      },
      create: {
        userId: user.id,
        tier: planId,
        siteLimit: siteLimit,
        storageLimitMB: storageLimitMB,
        aiTokenLimit: aiTokenLimit,
      }
    });

    return NextResponse.json({ message: "Infrastructure provisioned successfully" }, { status: 200 });

  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}