type BudgetHeaderProps = {
  projectName: string;
  clientName: string;
  percentage: number;
};

export function BudgetHeader({
  projectName,
  clientName,
  percentage,
}: BudgetHeaderProps) {
  return (
    <div className="budget-header">
      <div className="client-info">
        <h2>{projectName}</h2>
        <p>{clientName}</p>
      </div>
      <p className="progress-procent">{percentage.toFixed(0)}%</p>
    </div>
  );
}
