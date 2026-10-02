import { NextResponse } from "next/server";
import { getHomeData } from "@/lib/public-data";

export async function GET() {
  try {
    const data = await getHomeData();
    return NextResponse.json({
      success: true,
      projects: data.projects,
      count: data.projects.length,
      featuredCount: data.projects.filter((p) => p.featured).length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load portfolio projects",
        projects: [],
      },
      { status: 500 }
    );
  }
}
