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
        const errorData = (await res.json()) as { error?: string };
        setError(errorData.error || "Failed to fetch projects");
        return;
      }

      const data = await res.json();
      setProjects(data);
      setError(null);
    } catch {
      setError("Could not load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectBudgets();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchProjectBudgets();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <section className="projectSection">
        <div className="error">
          <p>{error}</p>
          <p>Failed to fetch project budgets</p>
        </div>
      </section>
    );
  }

  const displayProjects = projects.slice(0, 4);

  if (displayProjects.length === 0)
    return (
      <section className="projectSection">
        <div className="header">
          <h1>Project budget</h1>
        </div>
        <hr />
        <div className="message">
          <h1>🦣</h1>
          <p>No one is currently tracking time on a billable project</p>
        </div>
        <hr />
      </section>
    );

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
