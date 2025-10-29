type SimpleCardInfoProps = {
  name: string;
  role: string;
  projectName?: string;
};

export function SimpleCardInfo({
  name,
  role,
  projectName,
}: SimpleCardInfoProps) {
  return (
    <div className="employee-info">
      <div className="employee-name">{name}</div>
      <div className="project-name">{projectName || "Not tracking time"}</div>
      <span className="role">{role}</span>
    </div>
  );
}
