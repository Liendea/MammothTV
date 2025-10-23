// → Sanity client och queries

/*


import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN // För webhooks
});

// Helper functions
export async function getEmployees() {
  return sanityClient.fetch(`
    *[_type == "employee"] {
      name,
      "imageUrl": image.asset->url,
      role,
      harvestId
    }
  `);
}

  */

// Fetch team mock data from local file, later fetch from Sanity

import fs from "fs";
import path from "path";

export type TeamUser = {
  id: string;
  name: string;
  role: string;
  image: string;
};

/**
 * Hämtar teammedlemmar från mockdata (simulerar Sanity)
 */
export async function getTeam(): Promise<TeamUser[]> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "mockData",
    "MOCKTEAM.json"
  );

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);
    return data.users;
  } catch (error) {
    console.error("Error loading mock team data:", error);
    return [];
  }
}
