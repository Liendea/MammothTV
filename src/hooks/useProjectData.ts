import { useState, useEffect, useCallback } from "react";
import type { ProjectBudget } from "@/types/project";

export function useProjectData(refreshInterval: number = 60000) {
  const [projects, setProjects] = useState<ProjectBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project budgets from API
  const fetchProjectBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        setError(errorData.error || "Failed to fetch projects");
        return;
      }

      const data = await res.json();
      setProjects(data);
      setError(null);
    } catch {
      setError("Could not load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectBudgets();
  }, [fetchProjectBudgets]);

  // Auto-refresh, clears interval on unmount or interval change
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(fetchProjectBudgets, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchProjectBudgets]);

  return { projects, loading, error, refetch: fetchProjectBudgets };
}
