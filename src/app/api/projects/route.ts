import { getFilteredProjectBudgets } from "@/lib/dataIntegration";

export const revalidate = 60; // cachea 60 sec

export async function GET() {
  try {
    const projectBudgets = await getFilteredProjectBudgets();
    return Response.json(projectBudgets);
  } catch (error: unknown) {
    console.error("API route error:", error);

    return Response.json(
      {
        error: "Failed to fetch project budgets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
