import "@/app/styling/projectSection.scss";

type ProgressBarProps = {
  progress: number; // 0 - 100
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  // Decide color depending on procentage
  const fillColor =
    progress < 50 ? "#c4ff61" : progress < 70 ? "#F1B44D" : "#FF6767";

  return (
    <div className="project-budget">
      <h2>Project Name</h2>
      <div className="progress-wrapper">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%`, background: fillColor }}
          ></div>
        </div>
        <span className="progress-proncent">{progress}%</span>
      </div>
    </div>
  );
}
