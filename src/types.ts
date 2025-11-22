export enum TaskType {
  SIMPLE = 'SIMPLE', // Click to complete
  TIMED_BONUS = 'TIMED_BONUS', // Base points + bonus if before time
  MULTI_SUBTASK = 'MULTI_SUBTASK', // Multiple checkboxes (e.g. Video + HW)
  TIERED = 'TIERED', // Select one of options (e.g. Piano duration)
}

export interface SubTask {
  id: string;
  label: string;
  points: number;
}

export interface TierOption {
  id: string;
  label: string;
  points: number;
}

export interface TaskDefinition {
  id: string;
  title: string;
  category: 'SCHOOL' | 'HOME';
  type: TaskType;
  basePoints?: number;
  bonusPoints?: number;
  bonusConditionLabel?: string; // e.g., "Before 8:00 PM"
  subTasks?: SubTask[];
  tiers?: TierOption[];
}

export interface PointLog {
  id: string;
  timestamp: number; // Date.now()
  description: string;
  delta: number; // Positive for gain, negative for spend
  taskId?: string; // Optional link to a specific task
}

export interface AppState {
  totalPoints: number;
  logs: PointLog[];
  // We track completed task IDs for the *current day* to disable buttons or show checked state
  completedTaskIds: string[]; 
}