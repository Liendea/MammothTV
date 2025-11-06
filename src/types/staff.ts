export interface Staff {
  id: string;
  name: string;
  image: string;
  role: string;
  harvestId: string;
  initials: string;
  fun_fact: string;

  current_project?: {
    project_id: string;
    name: string;
    client: string;
  };
  time_entries?: Array<{
    hours_today: number;
  }>;
  activeProject?: string | null;
  isActive?: boolean;
  currentHours?: number;
}
