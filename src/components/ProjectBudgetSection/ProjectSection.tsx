"use client";

import ProjectBudget from "./ProjectBudget";
import LoadingSpinner from "../LoadingSpinner";
import { useProjectData } from "@/hooks/useProjectData";

export default function ProjectSection() {
  const { projects, loading, error } = useProjectData(60000);

  const displayProjects = projects.slice(0, 4);

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
          <ProjectBudget
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
