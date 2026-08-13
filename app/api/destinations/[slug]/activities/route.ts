import { NextResponse } from "next/server";
import { getDestinationActivities } from "@/lib/queries/destinations";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  const { slug } = await context.params;

  try {
    const activities = await getDestinationActivities(slug);

    return NextResponse.json({
      success: true,
      destination: slug,
      activities,
    });
  } catch (error) {
    console.error("Activities API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch activities",
      },
      { status: 500 }
    );
  }
}