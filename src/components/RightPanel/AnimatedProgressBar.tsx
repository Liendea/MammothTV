type AnimatedProgressBarProps = {
  percentage: number;
  fillColor: string;
};

export function AnimatedProgressBar({
  percentage,
  fillColor,
}: AnimatedProgressBarProps) {
  return (
    <div className="progress-wrapper">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${percentage || 0}%`,
            background: fillColor,
            transition: "width 0.3s ease-out",
          }}
        ></div>
      </div>
    </div>
  );
}
