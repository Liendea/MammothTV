import type { HarvestTimeEntriesResponse } from "@/types/harvest";

// Harvest API configuration
const HARVEST_BASE_URL = "https://api.harvestapp.com/v2";

// API headers for authentication and request formatting
const headers = {
  Authorization: `Bearer ${process.env.HARVEST_API_KEY}`,
  "Harvest-Account-Id": process.env.HARVEST_ACCOUNT_ID!,
  "User-Agent": "MammTV (support@mamm.tv)",
  "Content-Type": "application/json",
};

// Typ för Project Budget API response
interface ProjectBudgetResponse {
  results: Array<{
    project_id: number;
    project_name: string;
    client_id: number;
    client_name: string;
    budget_is_monthly: boolean;
    budget_by: "project_cost" | "project_hours";
    is_active: boolean;
    budget: number;
    budget_spent: number;
    budget_remaining: number;
  }>;
}

// Enkel cache - spara senaste data
let cachedTimeEntries: HarvestTimeEntriesResponse | null = null;
let cachedProjectBudget: ProjectBudgetResponse | null = null;

/**
 * Jämför två objekt genom att serialisera dem
 */
function isDataEqual<T>(data1: T, data2: T): boolean {
  return JSON.stringify(data1) === JSON.stringify(data2);
}

/**
 * Fetches only active time entries from Harvest API
 * Active time entries are those where is_running=true
 */
export async function getActiveTimeEntries() {
  // Fetch time entries filtered to only show running/active entries
  const response = await fetch(
    `${HARVEST_BASE_URL}/time_entries?is_running=true`,
    { headers }
  );

  // Handle API errors with detailed logging
  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "Harvest API error (time entries):",
      response.status,
      errorText
    );
    throw new Error(`Failed to fetch active time entries: ${response.status}`);
  }

  const data: HarvestTimeEntriesResponse = await response.json();

  // Jämför med cachad data
  const changed = !cachedTimeEntries || !isDataEqual(data, cachedTimeEntries);

  if (changed) {
    console.log("📊 Time entries har ändrats");
    cachedTimeEntries = data;
  } else {
    console.log("✓ Time entries oförändrad");
  }

  return { data, changed };
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

  const data: ProjectBudgetResponse = await response.json();

  // Jämför med cachad data
  const changed =
    !cachedProjectBudget || !isDataEqual(data, cachedProjectBudget);

  if (changed) {
    console.log("📊 Project budget har ändrats");
    cachedProjectBudget = data;
  } else {
    console.log("✓ Project budget oförändrad");
  }

  return { data, changed };
}
