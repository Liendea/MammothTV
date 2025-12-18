"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Staff } from "@/types/staff";

export function useStaffData(refreshInterval: number = 60000) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const staffRef = useRef<Staff[]>([]);

  // Helper function to check if two data sets are equal
  const isDataEqual = (a: Staff[], b: Staff[]) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Fetch staff data from API
  const fetchStaff = useCallback(async () => {
    const timestamp = new Date().toLocaleTimeString();
    try {
      const isInitialLoad = staffRef.current.length === 0;
      if (isInitialLoad) setLoading(true);

      const res = await fetch("/api/employees");

      if (!res.ok) {
        const errorData = (await res.json()) as { error?: string };
        setError(errorData.error || "Failed to fetch employees");
        console.log(`[${timestamp}] Failed to fetch staff: ${errorData.error}`);
        return;
      }

      const data: Staff[] = await res.json();

      // Normalize data
      const normalizedData = data.map((user: Staff) => ({
        ...user,
        isActive: Boolean(user.isActive),
      }));

      if (!isDataEqual(normalizedData, staffRef.current)) {
        console.log(
          `[${timestamp}] 🔄 COMPARING STAFF DATA — differences detected, updating state...`
        );
        setStaff(normalizedData);
        staffRef.current = normalizedData; // uppdatera ref
        setError(null);
        console.log(
          `[${timestamp}] ✅ STAFF STATE UPDATED — new staff:`,
          normalizedData
        );
      }
    } catch (err) {
      setError("Something went wrong when fetching employees." + err);
      console.log(`[${timestamp}] Error fetching staff:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    console.log(
      `[${new Date().toLocaleTimeString()}] ⏳ Fetching staff from API`
    );
    fetchStaff();
  }, [fetchStaff]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval <= 0) return;

    console.log(
      `[${new Date().toLocaleTimeString()}] 🔄 Setting up staff data auto-refresh every ${refreshInterval}ms`
    );
    const interval = setInterval(fetchStaff, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchStaff]);

  return { staff, loading, error, refetch: fetchStaff };
}
