import { useState, useEffect, useCallback } from "react";
import type { ProjectBudget } from "@/types/project";
import axios, { AxiosError } from "axios";

type ApiErrorResponse = {
  error?: string;
  details?: string;
};

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
      const response = await axios.get("/api/projects");
      const newData = (await response.data) as ProjectBudget[];

      // Only update state if the data has actually changed
      if (!isDataEqual(newData, projects)) {
        setProjects(newData);
        setError(null);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      let errorMessage: string = axiosError.message || "Unknown error";

      if (axiosError.response && axiosError.response.data) {
        // Försök att läsa felmeddelandet från den typade data
        const errorData = axiosError.response.data as ApiErrorResponse;

        errorMessage = errorData.error || axiosError.message;
      }

      setError("Something went wrong when fetching projects: " + errorMessage);
      console.error(`[${timestamp}] Error fetching projects:`, err);
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
