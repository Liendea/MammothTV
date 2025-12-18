import type { HarvestTimeEntry } from "@/types/harvest";
import { harvestFetch } from "./apiClient";

// Stores previous time entries to detect changes
let previousTimeEntries: HarvestTimeEntry[] = [];

/*
 Fetch active time entries from Harvest API
 Active time entries = is_running === true
 Detects if any entries have changed compared to the previous fetch
 */
export async function getActiveTimeEntries() {
  // Fetch data from Harvest API
  const data = await harvestFetch("/time_entries");

  /*
  Create a minimal summary for change detection:
  - id: unique identifier of the time entry
  - hours: hours tracked for this entry
  - is_running: whether the timer is currently active
  - project: the project object { id, name } to detect project changes
  */

  const currentSummary = data.time_entries.map((e: HarvestTimeEntry) => ({
    id: e.id,
    hours: e.hours,
    is_running: e.is_running,
    project: e.project,
  }));

  // Compare with previous fetch to detect changes
  const changed =
    currentSummary.length !== previousTimeEntries.length ||
    currentSummary.some((entry: HarvestTimeEntry, i: number) => {
      const prev = previousTimeEntries[i];
      return (
        !prev || // No previous entry at this index
        entry.id !== prev.id || // Entry ID changed
        entry.hours !== prev.hours || // Hours changed
        entry.is_running !== prev.is_running || // Timer status changed
        entry.project !== prev.project // Project changed
      );
    });

  // Log to console if changes were detected
  if (changed) {
    console.log(
      `[${new Date().toLocaleTimeString()}] ✅ HARVEST - Active time entries updated`
    );
  }

  // Update previousTimeEntries for next comparison
  previousTimeEntries = currentSummary;

  // Return the full API data (not just the summary)
  return data;
}
