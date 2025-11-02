"use client";

import { useState, useEffect, useCallback } from "react";
import type { Staff } from "@/types/staff";

export function useStaffData(refreshInterval: number = 60000) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    try {
      const res = await fetch("/api/employees");

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        setError(errorData.error || "Failed to fetch employees");
        return;
      }

      const data: Staff[] = await res.json();
      const dataWithActivity = data.map((user: Staff) => ({
        ...user,
        isActive: Boolean(user.isActive),
      }));

      setStaff(dataWithActivity);
      setError(null);
    } catch {
      setError("Something went wrong when fetching employees.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(fetchStaff, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchStaff]);

  return { staff, loading, error, refetch: fetchStaff };
}
