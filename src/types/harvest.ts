export interface HarvestUser {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
}

export interface HarvestProject {
  id: number;
  name: string;
  code?: string;
}

export interface HarvestClient {
  id: number;
  name: string;
  currency?: string;
}

export interface HarvestTimeEntry {
  id: number;
  spent_date: string;
  hours: number;
  hours_without_timer: number;
  rounded_hours: number;
  notes: string | null;
  is_locked: boolean;
  locked_reason: string | null;
  approval_status: string;
  is_closed: boolean;
  is_billed: boolean;
  timer_started_at: string | null;
  started_time: string | null;
  ended_time: string | null;
  is_running: boolean;
  billable: boolean;
  budgeted: boolean;
  billable_rate: number | null;
  cost_rate: number | null;
  created_at: string;
  updated_at: string;
  user: HarvestUser;
  client: HarvestClient;
  project: HarvestProject;
  task: {
    id: number;
    name: string;
  };
  user_assignment: Record<string, unknown>;
  task_assignment: Record<string, unknown>;
  invoice: unknown;
  external_reference: unknown;
}

export interface HarvestTimeEntriesResponse {
  time_entries: HarvestTimeEntry[];
  per_page?: number;
  total_pages?: number;
  total_entries?: number;
  next_page?: number | null;
  previous_page?: number | null;
  page?: number;
  links?: {
    first?: string;
    next?: string;
    previous?: string;
    last?: string;
  };
}
