import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (n)
      RETURN labels(n)[0] AS type, count(n) AS count
      ORDER BY type
    `);

    const stats = result.records.map((record) => ({
      type: record.get("type"),
      count: record.get("count").toNumber(),
    }));

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Graph stats error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch graph statistics",
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}