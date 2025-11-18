import { getProjectBudget } from "../harvest/projectBudgets";
import { getActiveTimeEntries } from "../harvest/timeEntries";
import type { HarvestTimeEntry } from "@/types/harvest";

/**
Combines project data with time entries to filter out projects with no time tracking
 */

export async function getFilteredProjectBudgets() {
  try {
    // Fetch both time entries and project budgets
    const [budgetResponse, timeResponse] = await Promise.all([
      getProjectBudget(),
      getActiveTimeEntries(),
    ]);

    const budgets =
      budgetResponse.results || budgetResponse.project_budget_reports || [];
    const timeEntries = timeResponse.time_entries || [];

    // Same filter as in getCombinedEmployeeData
    const MAX_HOURS = 24;
    const validTimeEntries = timeEntries.filter(
      (entry: HarvestTimeEntry) =>
        entry.is_running && // only active timers
        (entry.hours || 0) <= MAX_HOURS // Max 24 hours
    );

    // Create a SET to filter out duplicated active projects ID's
    const projectIdsWithTime = new Set(
      validTimeEntries
        .filter((entry: HarvestTimeEntry) => entry.is_running)
        .map((entry: HarvestTimeEntry) => entry.project.id)
    );

    // Only show project budgets for projects with active time tracking
    const filteredBudgets = budgets.filter((budget: { project_id: number }) =>
      projectIdsWithTime.has(budget.project_id)
    );

    return filteredBudgets;
  } catch (error) {
    console.error("Error filtering project budgets:", error);
    throw error;
  }
}
