"use client";

import "@/app/styling/staffSection.scss";
import StaffCard from "./StaffCard";
import LoadingSpinner from "../LoadingSpinner";
import type { Staff } from "../../types/staff";
import { useState, useEffect } from "react";

export default function StaffSection() {
  const [users, setUsers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees from api route
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();

      // Check if error in response
      if (data.error) {
        throw new Error(data.error);
      }

      setUsers(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing...");
      fetchEmployees();
    }, 600000); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  // Rotate array every 5 seconds
  useEffect(() => {
    if (users.length === 0) return;

    const rotateInterval = setInterval(() => {
      setUsers((prevUsers) => {
        const [first, ...rest] = prevUsers;
        return [...rest, first];
      });
    }, 5000);

    return () => clearInterval(rotateInterval);
  }, [users.length]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <section className="staffSection">
        <div className="error">
          <p>{error}</p>
          <p>Data will refresh automatically in a few minutes...</p>
        </div>
      </section>
    );
  }

  if (users.length === 0) {
    return (
      <section className="staffSection">
        <div className="empty">
          <p>No active employees</p>
          <small>Start a timer in Harvest to see activity</small>
        </div>
      </section>
    );
  }

  const visibleUsers = users.slice(0, 4);

  return (
    <section className="staffSection">
      {visibleUsers.map((user, index) => (
        <StaffCard
          key={user.id}
          staff={user}
          isExpanded={index === 0}
          showProgress={process.env.NEXT_PUBLIC_SHOW_PROGRESS_BAR === "true"}
        />
      ))}
    </section>
  );
}
