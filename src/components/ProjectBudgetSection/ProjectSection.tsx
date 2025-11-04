"use client";

import ProgressBar from "./ProgressBar";
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
        <div className="budget-wrapper">
          <ProgressBar
            key={1}
            projectName={"test"}
            clientName={"project.client_name"}
            budget={100}
            spent={80}
          />

          <ProgressBar
            key={7}
            projectName={"test"}
            clientName={"project.client_name"}
            budget={100}
            spent={80}
          />

          <ProgressBar
            key={7}
            projectName={"test"}
            clientName={"project.client_name"}
            budget={100}
            spent={80}
          />

          <ProgressBar
            key={2}
            projectName={"test"}
            clientName={"project.client_name"}
            budget={100}
            spent={80}
          />
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
