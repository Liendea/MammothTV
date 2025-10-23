export interface Staff {
  id: string;
  name: string;
  image: string;
  role: string;
  harvestId: string;
  initials: string;
  current_project?: {
    name: string;
    client: string;
  };
  time_entries?: Array<{
    hours_today: number;
    timer_started_at?: string;
  }>;
  activeProject?: string | null;
  isActive?: boolean;
  currentHours?: number;
  progress?: number;
}
