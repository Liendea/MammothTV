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

  // Return parsed JSON data
  return response.json();
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
