type Project = {
  name: string;
  client: string;
};

type ProjectDetailsProps = {
  project?: Project;
};

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <div className="card-details">
      <div className="detail-row">
        <span className="detail-label">CLIENT</span>
        <span className="detail-value">
          {project?.client || "Not tracking time"}
        </span>
      </div>

      <div className="detail-row">
        <span className="detail-label">PROJECT</span>
        <span className="detail-value">
          {project?.name || "Not tracking time"}
        </span>
      </div>
    </div>
  );
}
