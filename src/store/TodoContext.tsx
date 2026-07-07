import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Todo } from '../types';
import { readStored, usePersist } from '../hooks/useLocalStorage';
import { type Action, initialState, todoReducer } from './todoReducer';

const STORAGE_KEY = 'todo-app.todos';

interface TodoContextValue {
  todos: Todo[];
  view: import('../types').View;
  dispatch: React.Dispatch<Action>;
}

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState, (init) => ({
    ...init,
    todos: readStored<Todo[]>(STORAGE_KEY, []),
  }));

  usePersist(STORAGE_KEY, state.todos);

  return (
    <TodoContext.Provider value={{ todos: state.todos, view: state.view, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTodos(): TodoContextValue {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within a TodoProvider');
  return ctx;
}
