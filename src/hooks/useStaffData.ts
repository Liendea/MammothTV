"use client";

import { useState, useEffect, useCallback } from "react";
import type { Staff } from "@/types/staff";

export function useStaffData(refreshInterval: number = 60000) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if two data sets are equal
  const isDataEqual = (a: Staff[], b: Staff[]) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Fetch staff data from the API
  const fetchStaff = useCallback(async () => {
    const timestamp = new Date().toLocaleTimeString();
    try {
      // Only show loading state during the first fetch
      const isInitialLoad = staff.length === 0;
      if (isInitialLoad) setLoading(true);

      const res = await fetch("/api/employees");

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        setError(errorData.error || "Failed to fetch employees");
        console.log(`[${timestamp}] Failed to fetch staff: ${errorData.error}`);
        return;
      }

      const data: Staff[] = await res.json();

      // Normalize the data (e.g., ensure isActive is always boolean)
      const normalizedData = data.map((user: Staff) => ({
        ...user,
        isActive: Boolean(user.isActive),
      }));

      // Compare new data with the existing one before updating
      if (!isDataEqual(normalizedData, staff)) {
        setStaff(normalizedData);
        setError(null);
        console.log(
          `[${timestamp}] 📊 Staff data changed — updating state. Length: ${normalizedData.length}`
        );
      } else {
        console.log(
          `[${timestamp}] ✓ Staff data unchanged — skipping state update`
        );
      }
    } catch (err) {
      setError("Something went wrong when fetching employees." + err);
      console.log(`[${timestamp}] Error fetching staff:`, err);
    } finally {
      setLoading(false);
    }
  }, [staff]);

  // Initial fetch on mount
  useEffect(() => {
    console.log(
      `[${new Date().toLocaleTimeString()}] Fetching staff from API…`
    );
    fetchStaff();
  }, [fetchStaff]);

  // Auto-refresh logic
  useEffect(() => {
    if (refreshInterval <= 0) return;

    console.log(
      `[${new Date().toLocaleTimeString()}] Setting up staff data auto-refresh every ${refreshInterval}ms`
    );

    const interval = setInterval(fetchStaff, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchStaff]);

  return { staff, loading, error, refetch: fetchStaff };
}
