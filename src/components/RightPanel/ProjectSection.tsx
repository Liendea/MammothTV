"use client";

import ProgressBar from "./ProgressBar";
import { useState, useEffect } from "react";
import type { ProjectBudget } from "@/types/project";
import LoadingSpinner from "../LoadingSpinner";

export default function ProjectSection() {
  const [projects, setProjects] = useState<ProjectBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project budgets from API
  const fetchProjectBudgets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setProjects(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching project budgets:", err);
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProjectBudgets();
  }, []);

  // auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProjectBudgets();
    }, 60000); // 1 min = 60000 ms

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  const displayProjects = projects.slice(0, 4);

  return (
    <section className="projectSection">
      <div className="header">
        <h1>Project budget</h1>
      </div>
      <hr />
      <div className="budget-wrapper">
        {displayProjects.map((project) => (
          <ProgressBar
            key={project.project_id}
            projectName={project.project_name}
            clientName={project.client_name}
            budget={project.budget}
            spent={project.budget_spent}
          />
        ))}
      </div>

      <hr />
    </section>
  );
}
