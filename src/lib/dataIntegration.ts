import { getActiveTimeEntries, getProjectBudget } from "./harvest";
import { getTeam } from "./sanity";
import type { TeamUser } from "./sanity";
import type { Staff } from "@/types/staff";

/**
 Fetches and processes employee data from either MOCKTEAM (simulating Sanity cms data) or Harvest API
 For Harvest API: Shows ALL active time entries, even if a user has multiple
 Each time entry gets a unique ID to avoid React key conflicts
 */

export async function getCombinedEmployeeData(): Promise<Staff[]> {
  try {
    // fetch mock-team from lib (simulates Sanity until saity is set up)
    const teamUsers: TeamUser[] = await getTeam();

    // Fetch all active time entries from Harvest API
    const timeEntriesResponse = await getActiveTimeEntries();
    const timeEntries = timeEntriesResponse.time_entries || [];

    // Array to store all employee time entries (one per time entry, not per user)
    const allEmployees: Staff[] = [];

    // Set maximun hours to filter out faulty time_entries
    const MAX_HOURS = 48;

    // Loop through all team users
    teamUsers.forEach((teamUser) => {
      // Find all active time entries for this user
      const userTimeEntries = timeEntries.filter(
        (entry: any) =>
          entry.user.id.toString() === teamUser.id &&
          (entry.hours || 0) <= MAX_HOURS
      );

      if (userTimeEntries.length > 0) {
        // Map each time entry to a Staff object (unique id per entry)
        userTimeEntries.forEach((entry: any, index: number) => {
          const uniqueId = `${teamUser.id}-${entry.id || index}`;
          const fullName =
            entry.user.name ||
            `${entry.user.first_name || ""} ${
              entry.user.last_name || ""
            }`.trim();

          const initials = (() => {
            const nameParts = fullName.split(" ").filter(Boolean);
            if (nameParts.length >= 2)
              return `${nameParts[0][0]}${
                nameParts[nameParts.length - 1][0]
              }`.toUpperCase();
            return fullName[0]?.toUpperCase() || "?";
          })();

          allEmployees.push({
            id: uniqueId,
            name: fullName,
            image: teamUser.image || "",
            role: teamUser.role,
            harvestId: teamUser.id,
            initials,
            fun_fact: teamUser.fun_fact,
            current_project: {
              project_id: entry.project,
              name: entry.project.name,
              client: entry.client?.name || "No Client",
            },
            time_entries: [
              {
                hours_today: entry.hours || 0,
                timer_started_at: entry.timer_started_at || "",
              },
            ],
            isActive: entry.is_running,
            activeProject: entry.project.name,
            currentHours: entry.hours || 0,
            progress: 0,
          });
        });
      } else {
        // User has no active time entries → create default Staff object
        allEmployees.push({
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
          time_entries: [
            {
              hours_today: 0,
              timer_started_at: "",
            },
          ],
          isActive: false,
          activeProject: null,
          currentHours: 0,
          progress: 0,
        });
      }
    });

    return allEmployees;
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
    // Hämta både projektbudgetar och time entries
    const [budgetResponse, timeResponse] = await Promise.all([
      getProjectBudget(),
      getActiveTimeEntries(),
    ]);

    const budgets =
      budgetResponse.results || budgetResponse.project_budget_reports || [];
    const timeEntries = timeResponse.time_entries || [];

    // Skapa ett Set med alla projekt-ID:n från time entries
    const projectIdsWithTime = new Set(
      timeEntries.map((entry: any) => entry.project.id)
    );

    // Filtrera bort projektbudgetar som inte finns i time entries
    const filteredBudgets = budgets.filter((budget: any) =>
      projectIdsWithTime.has(budget.project_id)
    );

    return filteredBudgets;
  } catch (error) {
    console.error("Error filtering project budgets:", error);
    throw error;
  }
}
