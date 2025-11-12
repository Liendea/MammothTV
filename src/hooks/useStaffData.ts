"use client";
import { useState, useEffect, useCallback } from "react";
import type { Staff } from "@/types/staff";

export function useStaffData(refreshInterval: number = 60000) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    // Visa bara loading första gången
    const isInitialLoad = staff.length === 0;
    if (isInitialLoad) {
      setLoading(true);
    }

    try {
      const res = await fetch("/api/employees");
      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        setError(errorData.error || "Failed to fetch employees");
        return;
      }

      const responseData = await res.json();

      // Kolla om API returnerar { data, changed } format eller bara raw data
      let newStaff: Staff[];
      let hasChanged = true;

      if (responseData.data && typeof responseData.changed !== "undefined") {
        // Nytt format med cache
        newStaff = responseData.data;
        hasChanged = responseData.changed;
      } else {
        // Gammalt format, bara raw data
        newStaff = responseData;
      }

      // Uppdatera bara om data har ändrats
      if (hasChanged) {
        const dataWithActivity = newStaff.map((user: Staff) => ({
          ...user,
          isActive: Boolean(user.isActive),
        }));

        setStaff(dataWithActivity);
        setError(null);
      }
    } catch {
      setError("Something went wrong when fetching employees.");
    } finally {
      // Stäng bara av loading om det var initial load
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [staff.length]);

  // Initial fetch
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Auto-refresh, clears interval on unmount or interval change
  useEffect(() => {
    if (refreshInterval <= 0) return;
    const interval = setInterval(fetchStaff, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchStaff]);

  return { staff, loading, error, refetch: fetchStaff };
}
