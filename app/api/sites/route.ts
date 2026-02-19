import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1. Secure the endpoint
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the request
    const body = await req.json();
    const { name, subdomain } = body;

    if (!name || !subdomain) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 3. Ensure global subdomain uniqueness
    const existingSite = await prisma.site.findUnique({
      where: { subdomain: subdomain },
    });

    if (existingSite) {
      return NextResponse.json(
        { message: "This subdomain is already taken. Please choose another." }, 
        { status: 409 }
      );
    }

    // 4. Create the tenant in the database
    const newSite = await prisma.site.create({
      data: {
        name: name,
        subdomain: subdomain,
        user: {
          connect: { email: session.user.email }
        }
      }
    });

    return NextResponse.json(newSite, { status: 200 });

  } catch (error) {
    console.error("Site Creation Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}