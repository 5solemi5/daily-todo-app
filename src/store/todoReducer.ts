import type { Priority, Todo, TodoState, View } from '../types';

export type Action =
  | { type: 'ADD'; title: string; priority?: Priority; dueDate?: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'EDIT'; id: string; patch: Partial<Pick<Todo, 'title' | 'priority' | 'dueDate'>> }
  | { type: 'DELETE'; id: string }
  | { type: 'SET_VIEW'; view: View }
  | { type: 'HYDRATE'; todos: Todo[] };

export const initialState: TodoState = {
  todos: [],
  view: 'today',
};

/** Generate a unique id. Falls back to a timestamp-based id if crypto is unavailable. */
function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function todoReducer(state: TodoState, action: Action): TodoState {
  switch (action.type) {
    case 'ADD': {
      const title = action.title.trim();
      if (!title) return state; // ignore empty input (P: 빈 입력 무시)
      const todo: Todo = {
        id: newId(),
        title,
        done: false,
        priority: action.priority ?? 'normal',
        dueDate: action.dueDate || undefined,
        createdAt: new Date().toISOString(),
      };
      return { ...state, todos: [...state.todos, todo] };
    }

    case 'TOGGLE': {
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id
            ? {
                ...t,
                done: !t.done,
                completedAt: !t.done ? new Date().toISOString() : undefined,
              }
            : t,
        ),
      };
    }

    case 'EDIT': {
      const patch = { ...action.patch };
      if (typeof patch.title === 'string') {
        const trimmed = patch.title.trim();
        if (!trimmed) delete patch.title; // don't allow blanking the title
        else patch.title = trimmed;
      }
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.id ? { ...t, ...patch } : t)),
      };
    }

    case 'DELETE': {
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };
    }

    case 'SET_VIEW': {
      return { ...state, view: action.view };
    }

    case 'HYDRATE': {
      return { ...state, todos: action.todos };
    }

    default:
      return state;
  }
}
