// → Sanity client och queries

import { client } from "./sanity.client";

export interface TeamUser {
  id: string;
  name: string;
  role: string;
  image: string;
  fun_fact: string;
}

export async function getTeam(): Promise<TeamUser[]> {
  try {
    const query = `*[_type == "teamMember"] {
      "id": harvestId,
      name,
      role,
      "image": image.asset->url,
      fun_fact
    }`;

    const teamMembers = await client.fetch(query);
    return teamMembers || [];
  } catch (error) {
    console.error("Error fetching team from Sanity:", error);
    return [];
  }
}


// Fetch team mock data from local file, later fetch from Sanity
/*
import fs from "fs";
import path from "path";

export type TeamUser = {
  id: string;
  name: string;
  role: string;
  image: string;
  fun_fact: string;
};

/**
 * Hämtar teammedlemmar från mockdata (simulerar Sanity)

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
 */
