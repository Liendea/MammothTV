import "@/app/styling/projectSection.scss";

type ProgressBarProps = {
  progress: number; // 0 - 100
  projectName: string;
};

export default function ProgressBar({
  progress,
  projectName,
}: ProgressBarProps) {
  // Decide color depending on procentage,
  const fillColor =
    progress < 50 ? "#c4ff61" : progress < 70 ? "#F1B44D" : "#FF6767";

  // Trunc project name
  const truncateName =
    projectName.length > 50
      ? projectName.slice(0, 50).trimEnd() + "..."
      : projectName;

  return (
    <div className="project-budget">
      <h2>{truncateName}</h2>

      <div className="progress-wrapper">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%`, background: fillColor }}
          ></div>
        </div>
        <span className="progress-procent">{progress}%</span>
      </div>
    </div>
  );
}
