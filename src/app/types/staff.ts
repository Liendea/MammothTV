export type TimeEntry = {
  project_id: number;
  project_name: string;
  hours_today: number;
  hours_this_week: number;
  hours_this_month: number;
  last_entry: string;
} | null;

export type Project = {
  id: number;
  name: string;
  phase: string;
  client: string;
} | null;

export type Staff = {
  id: number;
  name: string;
  initials: string;
  email: string;
  role: string;
  avatar_color: string;
  status: string;
  img?: string;
  current_project: Project | null;
  time_entries: TimeEntry[] | null;
};
