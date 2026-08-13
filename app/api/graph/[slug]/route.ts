import { NextResponse } from "next/server";
import { getDestinationGraph } from "@/lib/queries/graph";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  request: Request,
  context: RouteContext
) {
  const { slug } = await context.params;

  try {
    const graph = await getDestinationGraph(slug);

    if (!graph) {
      return NextResponse.json(
        {
          success: false,
          message: "Graph not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      graph,
    });
  } catch (error) {
    console.error("Graph API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load graph data",
      },
      { status: 500 }
    );
  }
}