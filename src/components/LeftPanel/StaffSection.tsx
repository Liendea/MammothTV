"use client";

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

      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data: Staff[] = await res.json();

      const dataWithActivity = data.map((user: Staff) => {
        const isActive = Boolean(user.isActive);
        return {
          ...user,
          isActive,
        };
      });

      setUsers(dataWithActivity);
      setError(null);
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

  // Auto-refresh every minute
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchEmployees();
    }, 60000); // 1 min = 60000ms

    return () => clearInterval(refreshInterval);
  }, []);

  // Rotate array every 10 seconds
  useEffect(() => {
    if (users.length === 0) return;

    const rotateInterval = setInterval(() => {
      setUsers((prevUsers) => {
        const [first, ...rest] = prevUsers;
        return [...rest, first];
      });
    }, 10000);

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

  // ONöy show 4 users at the time
  const visibleUsers = users.slice(0, 4);

  return (
    <section className="staffSection">
      {visibleUsers.map((user, index) => (
        <StaffCard
          key={user.id}
          staff={user}
          isExpanded={index === 0}
          isActive={user.isActive || false}
          showProgress={process.env.NEXT_PUBLIC_SHOW_PROGRESS_BAR === "true"}
        />
      ))}
    </section>
  );
}
