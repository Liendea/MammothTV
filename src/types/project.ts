export type ProjectBudget = {
  project_id: number;
  project_name: string;
  client_id: number;
  client_name: string;
  budget_is_monthly: boolean;
  budget_by: "project_cost" | "project_hours"; // om API:t bara tillåter dessa
  is_active: boolean;
  budget: number;
  budget_spent: number;
  budget_remaining: number;
};
