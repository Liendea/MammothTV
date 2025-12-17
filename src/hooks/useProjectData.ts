import { useState, useEffect, useCallback } from "react";
import type { ProjectBudget } from "@/types/project";
import axios, { AxiosError } from "axios";

type ApiErrorResponse = {
  error?: string;
  details?: string;
};

// 🎯 STEG 1: DEFINIERA BAS-URL:EN
// Vi använder window.location.origin som är den säkraste metoden
// på klientsidan för att få den absoluta URL:en (inklusive http/https och port).
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Returnerar t.ex. "http://localhost:3000" eller "https://mammothtv.vercel.app"
    return window.location.origin;
  }

  // Fallback (mindre relevant i en Client Component, men bra att ha)
  return "http://localhost:3000";
};

// Beräkna den absoluta Bas-URL:en
const BASE_URL = getBaseUrl();
console.log(`[CLIENT] Using Base URL: ${BASE_URL}`);

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
      // 🔄 STEG 2: ANVÄND ABSOLUT URL I ANROPET
      const absoluteUrl = `${BASE_URL}/api/projects`;
      console.log(`[${timestamp}] Making request to: ${absoluteUrl}`);

      const response = await axios.get(absoluteUrl);
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
