// src/types.ts
export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  projectId: number;
  devId?: number; // optional if needed
}

export interface TaskEditDetails {
  id: number | null;
  title: string | null;
  description: string | null;
  status: string | null;
  dueDate?: string | null; // required!
}
