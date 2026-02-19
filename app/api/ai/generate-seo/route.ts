import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Authenticate the request
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Grab the context passed from the frontend
    const { pageTitle, siteName, pageContent } = await req.json();

    // ------------------------------------------------------------------
    // 3. THE AI ENGINE (Currently simulated for immediate local testing)
    // Later, replace this block with an OpenAI or Google Gemini API call.
    // ------------------------------------------------------------------
    
    // Simulate the 1.5-second delay it takes an LLM to "think" and generate text
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Dynamically generate intelligent SEO data based on the page context
    const generatedData = {
      metaTitle: `${pageTitle} | ${siteName} - Premium Solutions`,
      metaDescription: `Discover high-quality services and solutions on our ${pageTitle} page. ${siteName} provides industry-leading expertise tailored for your business success and digital growth.`,
      focusKeywords: [pageTitle.toLowerCase(), siteName.toLowerCase(), "premium solutions", "industry leaders", "digital growth"],
      aiSeoScore: Math.floor(Math.random() * (99 - 85 + 1) + 85), // Random high score between 85 and 99
    };

    // ------------------------------------------------------------------

    // 4. Return the generated JSON back to the Builder UI
    return NextResponse.json(generatedData, { status: 200 });

  } catch (error) {
    console.error("AI_GENERATOR_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}