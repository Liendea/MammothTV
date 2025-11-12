import { getFilteredProjectBudgets } from "@/lib/dataIntegration";

export async function GET() {
  try {
    const { data: projects, changed } = await getFilteredProjectBudgets();

    return Response.json({
      data: projects,
      changed,
    });
  } catch (error: unknown) {
    console.error("API route error:", error);
    return Response.json(
      {
        error: "Failed to fetch projects",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
