"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Staff } from "@/types/staff";
import axios, { AxiosError } from "axios";

type ApiErrorResponse = {
  error?: string;
  details?: string;
};

export function useStaffData(refreshInterval: number = 60000) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ref för senaste staff för jämförelse
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

      const response = await axios.get("/api/employees");
      const data: Staff[] = response.data;

      // Normalize data
      const normalizedData = data.map((user: Staff) => ({
        ...user,
        isActive: Boolean(user.isActive),
      }));

      if (!isDataEqual(normalizedData, staffRef.current)) {
        setStaff(normalizedData);
        staffRef.current = normalizedData;
        setError(null);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      let errorMessage: string = axiosError.message || "Unknown error";

      if (axiosError.response && axiosError.response.data) {
        const errorData = axiosError.response.data as ApiErrorResponse;
        errorMessage = errorData.error || axiosError.message;
      }

      setError("Something went wrong when fetching employees: " + errorMessage);
      console.error(`[${timestamp}] Error fetching staff:`, err);
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
