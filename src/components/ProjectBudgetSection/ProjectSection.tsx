"use client";

import ProjectBudget from "./ProjectBudget";
import LoadingSpinner from "../LoadingSpinner";
import { useProjectData } from "@/hooks/useProjectData";

export default function ProjectSection() {
  const { projects, loading, error } = useProjectData(60000);

  // Sort projects by budget spent ratio and take top 4
  const displayProjects = [...projects]
    .sort((a, b) => {
      const aRatio = a.budget > 0 ? a.budget_spent / a.budget : -1;
      const bRatio = b.budget > 0 ? b.budget_spent / b.budget : -1;
      return bRatio - aRatio;
    })
    .slice(0, 4);

  // DEBUG: Show loading state details on screen (remove after fixing)
  const debugBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'SSR';
  const debugEnvUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'not set';

  if (loading) return (
    <div style={{ color: 'white', padding: '20px', fontSize: '14px', wordBreak: 'break-all' }}>
      <p><strong>Projects Debug:</strong></p>
      <p>window.location.origin: {debugBaseUrl}</p>
      <p>NEXT_PUBLIC_API_BASE_URL: {debugEnvUrl}</p>
      <p>Projects API loading: {String(loading)}</p>
      <p>Projects count: {projects.length}</p>
      <p>Error: {error || 'none'}</p>
      <LoadingSpinner />
    </div>
  );

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
