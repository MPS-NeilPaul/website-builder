import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Extract the data sent from the Builder UI
    const body = await req.json();
    const { title, slug, status, metaTitle, metaDescription, focusKeywords, content, aiSeoScore } = body;

    // 3. Security Check: Find the user's ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    // 4. Security Check: Ensure this page belongs to a site owned by this user
    const pageToUpdate = await prisma.page.findUnique({
      where: { id: params.id },
      include: { site: true }
    });

    if (!pageToUpdate || pageToUpdate.site.userId !== user.id) {
      return new NextResponse("Unauthorized access to this page", { status: 403 });
    }

    // 5. Save everything to PostgreSQL
    const updatedPage = await prisma.page.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        status,
        metaTitle,
        metaDescription,
        focusKeywords,
        content, // This will hold your drag-and-drop JSON tree later
        aiSeoScore,
      }
    });

    return NextResponse.json(updatedPage, { status: 200 });

  } catch (error) {
    console.error("PAGE_SAVE_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}