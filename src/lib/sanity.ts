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
