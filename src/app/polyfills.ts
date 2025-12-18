// polyfills.ts
import "intersection-observer";

if (typeof window !== "undefined" && !("fetch" in window)) {
  import("whatwg-fetch").catch((err) => {
    console.error("Failed to load fetch polyfill:", err);
  });
}
