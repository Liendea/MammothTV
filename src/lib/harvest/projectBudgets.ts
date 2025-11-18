import { harvestFetch } from "./apiClient";

/*
 Fetches project budget reports from Harvest API
 */
export async function getProjectBudget() {
  const data = await harvestFetch("/reports/project_budget");
  return data;
}
