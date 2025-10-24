import "@/app/styling/projectSection.scss";

type ProgressBarProps = {
  projectName: string;
  budget: number;
  spent: number;
};

export default function ProgressBar({
  projectName,
  budget,
  spent,
  clientName,
}: ProgressBarProps) {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const cappedPercentage = Math.min(percentage, 100);

  // Decide color depending on procentage,
  const fillColor =
    percentage < 50 ? "#c4ff61" : percentage < 70 ? "#F1B44D" : "#FF6767";

  // Trunc project name
  const truncateName =
    projectName.length > 50
      ? projectName.slice(0, 50).trimEnd() + "..."
      : projectName;

  return (
    <div className="project-budget">
      <h2>{`${clientName}  - ${truncateName}`}</h2>

      <div className="progress-wrapper">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${cappedPercentage}%`, background: fillColor }}
          ></div>
        </div>
        <span className="progress-procent">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}
