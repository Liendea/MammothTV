import { getCombinedEmployeeData } from "@/lib/dataIntegration";

export async function GET() {
  try {
    const employees = await getCombinedEmployeeData();
    return Response.json(employees);
  } catch (error: unknown) {
    console.error("API route error:", error);

    return Response.json(
      {
        error: "Failed to fetch employees",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
