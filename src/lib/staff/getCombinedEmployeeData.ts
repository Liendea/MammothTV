import { getActiveTimeEntries } from "../harvest/timeEntries";
import { getTeam } from "../sanity/sanity";
import type { TeamUser } from "../sanity/sanity";
import type { Staff } from "@/types/staff";
import type { HarvestTimeEntry } from "@/types/harvest";

/*
  Fetches and combines employee data from both Sanity (team info) and Harvest (time entries).

  For Harvest:
  - Includes all active time entries for each user.
  - Uses only the first time entry for displaying current project info.
*/
export async function getCombinedEmployeeData(): Promise<Staff[]> {
  try {
    // Fetch team members from Sanity
    const teamUsers: TeamUser[] = await getTeam();

    // Fetch active time entries from Harvest
    const timeEntriesResponse = await getActiveTimeEntries();
    const timeEntries = timeEntriesResponse.time_entries || [];

    // Define maximum hours to consider as valid (ignore entries exceeding this)
    const MAX_HOURS = 24;

    // Filter out any time entries that exceed MAX_HOURS
    const validTimeEntries = timeEntries.filter(
      (entry: HarvestTimeEntry) => (entry.hours || 0) <= MAX_HOURS
    );

    // Map to store combined staff data keyed by user ID
    const staffMap: Record<string, Staff> = {};

    // Iterate over each team user to combine data
    teamUsers.forEach((teamUser) => {
      // Get all valid time entries for this user
      const userTimeEntries = validTimeEntries.filter(
        (entry: HarvestTimeEntry) =>
          entry.user.id.toString() === teamUser.id.toString()
      );

      if (userTimeEntries.length > 0) {
        // If the user has multiple time entries, pick the first one for project info
        const firstEntry = userTimeEntries[0];

        // Construct Staff object combining Sanity info with Harvest time entries
        staffMap[teamUser.id] = {
          id: teamUser.id, // constant per user
          name: teamUser.name,
          image: teamUser.image || "",
          role: teamUser.role,
          harvestId: teamUser.id,
          // Generate initials from name
          initials: teamUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          fun_fact: teamUser.fun_fact,
          // Current project based on the first time entry
          current_project: {
            project_id: firstEntry.project.toString(),
            name: firstEntry.project.name,
            client: firstEntry.client?.name || "No Client",
          },
          // All user's time entries
          time_entries: userTimeEntries.map((entry: HarvestTimeEntry) => ({
            hours_today: entry.hours || 0,
          })),
          isActive: true, // user has at least one active time entry
          activeProject: firstEntry.project.name,
          currentHours: firstEntry.hours || 0,
        };
      } else {
        // User has no active time entries → create default Staff object
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

    // Return an array of all staff objects
    return Object.values(staffMap);
  } catch (error) {
    console.error("Error combining employee data:", error);
    throw error;
  }
}
