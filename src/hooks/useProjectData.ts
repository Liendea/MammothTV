import { useState, useEffect, useCallback, useRef } from "react";
import type { ProjectBudget } from "@/types/project";
import axios, { AxiosError } from "axios";

type ApiErrorResponse = {
  error?: string;
  details?: string;
};

// STEG 1: DEFINIERA BAS-URL:EN
// Beräkna den absoluta Bas-URL:en
const BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
console.log(`[CLIENT] Using Base URL (from env var): ${BASE_URL}`);

// Custom hook: fetches and auto-refreshes project budget data from the API
export function useProjectData(refreshInterval: number = 60000) {
  const [projects, setProjects] = useState<ProjectBudget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref för senaste projects för jämförelse (prevents infinite loop)
  const projectsRef = useRef<ProjectBudget[]>([]);

  // Helper function: shallow comparison of old and new project data
  const isDataEqual = (a: ProjectBudget[], b: ProjectBudget[]) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Fetch project budgets from the backend
  const fetchProjectBudgets = useCallback(async () => {
    const timestamp = new Date().toLocaleTimeString();
    try {
      const isInitialLoad = projectsRef.current.length === 0;
      if (isInitialLoad) setLoading(true);

      // 🔄 STEG 2: ANVÄND ABSOLUT URL I ANROPET
      const absoluteUrl = `${BASE_URL}/api/projects`;
      console.log(`[${timestamp}] Making request to: ${absoluteUrl}`);

      const response = await axios.get(absoluteUrl);
      const newData = (await response.data) as ProjectBudget[];

      // Only update state if the data has actually changed
      if (!isDataEqual(newData, projectsRef.current)) {
        setProjects(newData);
        projectsRef.current = newData;
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
  }, []);

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
