export type Priority = 'high' | 'normal' | 'low';
export type View = 'today' | 'upcoming' | 'done';

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string; // ISO
  completedAt?: string; // ISO
}

export interface TodoState {
  todos: Todo[];
  view: View;
}
