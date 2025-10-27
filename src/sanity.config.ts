import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import type { Rule } from "sanity";

const teamMember = {
  name: "teamMember",
  title: "Team Members",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "harvestId",
      title: "Harvest User ID",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "role",
      title: "Role",
      type: "string",
    },
    {
      name: "image",
      title: "Profile Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "fun_fact",
      title: "Fun Fact",
      type: "text",
    },
  ],
};

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: "Mammoth TV",
  basePath: "/studio",
  plugins: [deskTool()],
  schema: {
    types: [teamMember],
  },
});
