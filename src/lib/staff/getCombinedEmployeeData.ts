import { getActiveTimeEntries } from "../harvest/timeEntries";
import { getTeam } from "../sanity/sanity";
import type { TeamUser } from "../sanity/sanity";
import type { Staff } from "@/types/staff";
import type { HarvestTimeEntry } from "@/types/harvest";

/**
 * Kontrollerar om datumet är idag (YYYY-MM-DD).
 */
function isToday(dateString: string): boolean {
  const todayStr = new Date().toISOString().split("T")[0];
  return dateString === todayStr;
}

export async function getCombinedEmployeeData(): Promise<Staff[]> {
  try {
    const teamUsers: TeamUser[] = await getTeam();
    const timeEntriesResponse = await getActiveTimeEntries();
    const timeEntries = timeEntriesResponse.time_entries || [];

    const MAX_HOURS = 24;
    const staffMap: Record<string, Staff> = {};

    teamUsers.forEach((teamUser) => {
      // 1. Hämta alla dagens poster för användaren
      const userTimeEntries = timeEntries.filter(
        (entry: HarvestTimeEntry) =>
          entry.user.id.toString() === teamUser.id.toString() &&
          isToday(entry.spent_date) &&
          (entry.hours || 0) <= MAX_HOURS
      );

      // 2. Summera alla timmar för dagen (viktigt för att det ska bli rätt total)
      const totalHoursToday = userTimeEntries.reduce(
        (sum: number, entry: HarvestTimeEntry) => sum + (entry.hours || 0),
        0
      );

      // 3. Hitta posten som körs just nu, annars ta den senaste
      const runningEntry = userTimeEntries.find(
        (entry: HarvestTimeEntry) => entry.is_running
      );
      const activeEntry = runningEntry || userTimeEntries[0];

      if (userTimeEntries.length > 0 && activeEntry) {
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

          current_project: {
            project_id: activeEntry.project.id.toString(),
            name: activeEntry.project.name,
            client: activeEntry.client?.name || "No Client",
          },

          // Här lägger vi ihop allt
          time_entries: [{ hours_today: totalHoursToday }],
          isActive: !!runningEntry,
          activeProject: activeEntry.project.name,
          currentHours: totalHoursToday,
        };
      } else {
        // Default för de som inte har några poster idag
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
