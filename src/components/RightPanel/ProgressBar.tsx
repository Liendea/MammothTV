"use client";


import { useState, useEffect } from "react";

type ProgressBarProps = {
  projectName: string;
  clientName: string;
  budget: number;
  spent: number;
};

export default function ProgressBar({
  projectName,
  budget,
  spent,
  clientName,
}: ProgressBarProps) {
  const targetPercentage = budget > 0 ? (spent / budget) * 100 : 0;
  const cappedTarget = Math.min(targetPercentage, 100);

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Animate both bar width and number
  useEffect(() => {
    let start: number | null = null;
    const duration = 2000; // 2s animation
    const startValue = targetPercentage / 2; // start att half target value instead of 0
    const endValue = cappedTarget;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = startValue + (endValue - startValue) * progress;
      setAnimatedPercentage(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [cappedTarget, targetPercentage]);

  // Decide color depending on %,
  const fillColor =
    animatedPercentage < 50
      ? "#c4ff61"
      : animatedPercentage < 70
      ? "#F1B44D"
      : "#FF6767";

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
            style={{
              width: `${animatedPercentage || 0}%`,
              background: fillColor,
              transition: "width 0.3s ease-out",
            }}
          ></div>
        </div>
        <span className="progress-procent">
          {animatedPercentage.toFixed(0)}% {/* zero decimals */}
        </span>
      </div>
    </div>
  );
}
