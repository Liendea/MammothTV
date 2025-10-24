import { getFilteredProjectBudgets } from "@/lib/dataIntegration";

export async function GET() {
  try {
    console.log("Fetching data from Harvest");
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
