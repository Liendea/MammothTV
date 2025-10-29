"use client";
import ExpandedCard from "./ExpandedCard";
import SimpleCard from "./SimpleCard";
import LoadingSpinner from "../LoadingSpinner";
import type { Staff } from "../../types/staff";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function StaffSection() {
  const [users, setUsers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees from API
  const fetchEmployees = async () => {
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
      setUsers(dataWithActivity);
      setError(null);
    } catch {
      setError("Something went wrong when fetching employees.");
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
    }, 60000);
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
          <p>Failed to fetch team members</p>
        </div>
      </section>
    );
  }

  const visibleUsers = users.slice(0, 4); //Only show 4 users
  const expandedUser = visibleUsers[0]; // First user is expanded
  const simpleUsers = visibleUsers.slice(1); // The rest is simple

  return (
    <section className="staffSection">
      {/* Expanded card slot */}
      <div className="expanded-slot">
        <AnimatePresence mode="wait">
          {expandedUser && (
            <motion.div
              key={`expanded-${expandedUser.id}`}
              initial={{ opacity: 0, scale: 1, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -100 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ExpandedCard
                staff={expandedUser}
                showProgress={
                  process.env.NEXT_PUBLIC_SHOW_PROGRESS_BAR === "true"
                }
                isActive={expandedUser.isActive || false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simple cards */}
      <div className="simple-cards">
        <AnimatePresence>
          {simpleUsers.map((user) => (
            <motion.div
              key={user.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <SimpleCard staff={user} isActive={user.isActive || false} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
