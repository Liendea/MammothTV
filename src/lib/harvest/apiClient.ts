/**
 * Base API client for Harvest
 * Handles base URL, headers, and fetch wrapper
 */

const HARVEST_BASE_URL = "https://api.harvestapp.com/v2";

export const headers = {
  Authorization: `Bearer ${process.env.HARVEST_API_KEY}`,
  "Harvest-Account-Id": process.env.HARVEST_ACCOUNT_ID!,
  "User-Agent": "MammTV (support@mamm.tv)",
  "Content-Type": "application/json",
};

/**
 * Generic fetch wrapper for Harvest API
 * Handles errors and JSON parsing
 */
export async function harvestFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${HARVEST_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Harvest API error (${endpoint}):`,
      response.status,
      errorText
    );
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
  }

  return response.json();
}
