"use client";
import { useAnimatedProgress } from "../../hooks/useAnimatedProgress";
import { getProgressColor, truncateText } from "./ProgressUtils";
import { BudgetHeader } from "./BudgetHeader";
import { AnimatedProgressBar } from "./AnimatedProgressBar";

type ProjectBudgetProps = {
  projectName: string;
  clientName: string;
  budget: number;
  spent: number;
};

export default function ProjectBudget({
  projectName,
  budget,
  spent,
  clientName,
}: ProjectBudgetProps) {
  const targetPercentage = budget > 0 ? (spent / budget) * 100 : 0;
  const animatedPercentage = useAnimatedProgress(targetPercentage);
  const fillColor = getProgressColor(animatedPercentage);
  const truncatedName = truncateText(projectName, 30);

  return (
    <div className="project-budget">
      <BudgetHeader
        projectName={truncatedName}
        clientName={clientName}
        percentage={animatedPercentage}
      />
      <AnimatedProgressBar
        percentage={animatedPercentage}
        fillColor={fillColor}
      />
    </div>
  );
}
