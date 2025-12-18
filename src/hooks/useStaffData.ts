import { useState, useEffect, useCallback } from "react";
import type { ProjectBudget } from "@/types/project";

// Custom hook: fetches and auto-refreshes project budget data from the API
export function useProjectData(refreshInterval: number = 60000) {
  const [projects, setProjects] = useState<ProjectBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function: shallow comparison of old and new project data
  const isDataEqual = (a: ProjectBudget[], b: ProjectBudget[]) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Fetch project budgets from the backend
  const fetchProjectBudgets = useCallback(async () => {
    const timestamp = new Date().toLocaleTimeString();
    setLoading(true);
    try {
      const res = await fetch("/api/projects");

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        setError(errorData.error || "Failed to fetch projects");
        console.log(
          `[${timestamp}] Failed to fetch projects: ${errorData.error}`
        );
        return;
      }

      const newData = await res.json();

      // Only update state if the data has actually changed
      if (!isDataEqual(newData, projects)) {
        setProjects(newData);
        setError(null);
        console.log(`[${timestamp}] ✅ Projects changed — updating state.`);
      } else {
        console.log(
          `[${timestamp}] ⭕️ Projects unchanged — skipping state update.`
        );
      }
    } catch (err) {
      setError("Could not load projects");
      console.log(`[${timestamp}] Error fetching projects:`, err);
    } finally {
      setLoading(false);
    }
  }, [projects]);

  // Initial fetch on mount
  useEffect(() => {
    fetchProjectBudgets();
  }, [fetchProjectBudgets]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(fetchProjectBudgets, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchProjectBudgets]);

  return { projects, loading, error, refetch: fetchProjectBudgets };
}
