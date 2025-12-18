import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "@sanity/types";

export const getClient = () =>
  createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2024-01-01",
    useCdn: true, // use CDN for faster fetching
  });

export const urlFor = (source: Image) =>
  imageUrlBuilder(getClient()).image(source);
