import type { HarvestTimeEntry } from "@/types/harvest";

// Harvest API configuration
const HARVEST_BASE_URL = "https://api.harvestapp.com/v2";

// API headers for authentication and request formatting
const headers = {
  Authorization: `Bearer ${process.env.HARVEST_API_KEY}`,
  "Harvest-Account-Id": process.env.HARVEST_ACCOUNT_ID!,
  "User-Agent": "MammTV (support@mamm.tv)",
  "Content-Type": "application/json",
};

/**
 * Fetches only active time entries from Harvest API
 * Active time entries are those where is_running=true
 */

let previousTimeEntries: Partial<HarvestTimeEntry>[] = [];

export async function getActiveTimeEntries() {
  const response = await fetch(
    `${HARVEST_BASE_URL}/time_entries?is_running=true`,
    { headers }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "Harvest API error (time entries):",
      response.status,
      errorText
    );
    throw new Error(`Failed to fetch active time entries: ${response.status}`);
  }
  console.log(
    `[${new Date().toLocaleTimeString()}] ✅ HARVEST - Harvest data changed — updating employees.`
  );

  const data = await response.json();
  const currentSummary = data.time_entries.map((e: HarvestTimeEntry) => ({
    id: e.id,
    hours: e.hours,
    is_running: e.is_running,
  }));

  const changed =
    currentSummary.length !== previousTimeEntries.length ||
    currentSummary.some((entry: HarvestTimeEntry, i: number) => {
      const prev = previousTimeEntries[i];
      return (
        !prev ||
        entry.id !== prev.id ||
        entry.hours !== prev.hours ||
        entry.is_running !== prev.is_running
      );
    });

  if (changed) {
    console.log(
      `[${new Date().toLocaleTimeString()}]  ✅ HARVEST - data updated!`
    );
  }

  previousTimeEntries = currentSummary;

  return data;
}

/**
 * Fetches project budget information from Harvest API
 */
export async function getProjectBudget() {
  const response = await fetch(`${HARVEST_BASE_URL}/reports/project_budget`, {
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "Harvest API error (project budget):",
      response.status,
      errorText
    );
    throw new Error(`Failed to fetch project budget: ${response.status}`);
  }

  return response.json();
}
