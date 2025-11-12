import { useState, useEffect, useCallback } from "react";
import type { ProjectBudget } from "@/types/project";

export function useProjectData(refreshInterval: number = 60000) {
  const [projects, setProjects] = useState<ProjectBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch project budgets från API
  const fetchProjectBudgets = useCallback(async () => {
    // Visa bara loading första gången (när vi inte har någon data)
    const isInitialLoad = projects.length === 0;
    if (isInitialLoad) {
      setLoading(true);
    }

    try {
      const res = await fetch("/api/projects");
      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        setError(errorData.error || "Failed to fetch projects");
        return;
      }

      const { data, changed } = await res.json();

      // Uppdatera bara om data faktiskt har ändrats
      if (changed) {
        setProjects(data);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch {
      setError("Could not load projects");
    } finally {
      // Stäng bara av loading om det var initial load
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [projects.length]);

  // Initial fetch
  useEffect(() => {
    fetchProjectBudgets();
  }, [fetchProjectBudgets]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(fetchProjectBudgets, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchProjectBudgets]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjectBudgets,
    lastUpdated,
  };
}
