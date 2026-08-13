import { NextResponse } from "next/server";
import { getDestinationBySlug } from "@/lib/queries/destinations";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  const { slug } = await context.params;

  try {
    const destination = await getDestinationBySlug(slug);

    if (!destination) {
      return NextResponse.json(
        {
          success: false,
          message: "Destination not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      destination,
    });
  } catch (error) {
    console.error("Destination API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the graph database",
      },
      { status: 500 }
    );
  }
}