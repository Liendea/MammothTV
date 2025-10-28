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

  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Animate both bar width and number
  useEffect(() => {
    let start: number | null = null;
    const duration = 2000; // 2s animation
    const startValue = targetPercentage / 2; // start att half target value instead of 0
    const endValue = targetPercentage;

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
  }, [targetPercentage]);

  // Decide color depending on %,
  const fillColor =
    animatedPercentage < 50
      ? "linear-gradient(90deg, #e6ffb3 0%, #c4ff61 100%)"
      : animatedPercentage < 70
        ? "linear-gradient(90deg, #fde3b3 0%, #F1B44D 100%)"
        : "linear-gradient(90deg, #ffb3b3 0%, #FF6767 100%)";

  // Trunc project name
  const truncateName =
    projectName.length > 40
      ? projectName.slice(0, 40).trimEnd() + "..." // Trim project name to 40 characters
      : projectName;

  return (
    <div className="project-budget">
      <div className="budget-info">
        <div className="client-info">
          <h2>{` ${truncateName}`}</h2>
          <p>{`${clientName} `}</p>
        </div>

        <p className="progress-procent">
          {animatedPercentage.toFixed(0)}% {/* zero decimals */}
        </p>
      </div>

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
      </div>
    </div>
  );
}
