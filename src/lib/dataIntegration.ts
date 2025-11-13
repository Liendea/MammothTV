import { getActiveTimeEntries, getProjectBudget } from "./harvest";
import { getTeam } from "./sanity";
import type { TeamUser } from "./sanity";
import type { Staff } from "@/types/staff";
import type { HarvestTimeEntry } from "@/types/harvest";

/**
 Fetches and processes employee data from  Sanity and Harvest API
 For Harvest API: Shows ALL active time entries, even if a user has multiple
 Each time entry gets a unique ID to avoid React key conflicts
 */

// ----------------------------
// Updated getCombinedEmployeeData
// ----------------------------

export async function getCombinedEmployeeData(): Promise<Staff[]> {
  try {
    const teamUsers: TeamUser[] = await getTeam();
    const timeEntriesResponse = await getActiveTimeEntries();
    const timeEntries = timeEntriesResponse.time_entries || [];

    const MAX_HOURS = 24;
    const validTimeEntries = timeEntries.filter(
      (entry: HarvestTimeEntry) => (entry.hours || 0) <= MAX_HOURS
    );

    const staffMap: Record<string, Staff> = {};

    teamUsers.forEach((teamUser) => {
      // Hämta tidposter för denna användare
      const userTimeEntries = validTimeEntries.filter(
        (entry: HarvestTimeEntry) =>
          entry.user.id.toString() === teamUser.id.toString()
      );

      if (userTimeEntries.length > 0) {
        // Om flera tidposter, kombinera info på samma Staff-objekt
        const firstEntry = userTimeEntries[0];

        staffMap[teamUser.id] = {
          id: teamUser.id, // konstant per användare
          name: teamUser.name,
          image: teamUser.image || "",
          role: teamUser.role,
          harvestId: teamUser.id,
          initials: teamUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          fun_fact: teamUser.fun_fact,
          current_project: {
            project_id: firstEntry.project.toString(),
            name: firstEntry.project.name,
            client: firstEntry.client?.name || "No Client",
          },
          time_entries: userTimeEntries.map((entry: HarvestTimeEntry) => ({
            hours_today: entry.hours || 0,
          })),
          isActive: true,
          activeProject: firstEntry.project.name,
          currentHours: firstEntry.hours || 0,
        };
      } else {
        // Ingen aktiv tid → standard Staff
        staffMap[teamUser.id] = {
          id: teamUser.id,
          name: teamUser.name,
          image: teamUser.image || "",
          role: teamUser.role,
          harvestId: teamUser.id,
          initials: teamUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          fun_fact: teamUser.fun_fact,
          current_project: undefined,
          time_entries: [{ hours_today: 0 }],
          isActive: false,
          activeProject: null,
          currentHours: 0,
        };
      }
    });

    return Object.values(staffMap);
  } catch (error) {
    console.error("Error combining employee data:", error);
    throw error;
  }
}

//_______________________________________________________//

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
