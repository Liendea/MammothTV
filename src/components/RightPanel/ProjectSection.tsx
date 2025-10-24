"use client";

import "@/app/styling/projectSection.scss";
import ProgressBar from "./ProgressBar";
import { useState, useEffect } from "react";
import type { ProjectBudget } from "@/types/project";
import LoadingSpinner from "../LoadingSpinner";

export default function ProjectSection() {
  const [projects, setProjects] = useState<ProjectBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees from api route
  const fetchProjectBudgets = async () => {
    try {
      const res = await fetch("/api/projects");

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }

      const data = await res.json();

      // Check if error in response
      if (data.error) {
        throw new Error(data.error);
      }

      setProjects(data);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error:", error);
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProjectBudgets();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  return (
    <section className="projectSection">
      <div className="header">
        <h1>Project budget</h1>
      </div>
      <hr />
      <div className="budget-wrapper">
        {projects.map((project) => (
          <ProgressBar
            key={project.project_id}
            projectName={project.project_name}
            clientName={project.client_name}
            budget={project.budget}
            spent={project.budget_spent}
          />
        ))}

        {/* Test-data för design 
        <ProgressBar progress={45} projectName="ProjectName" />
        <ProgressBar progress={110} projectName="ProjectName" />
        <ProgressBar progress={15} projectName="ProjectName" />*/}
      </div>
      <hr />
    </section>
  );
}
