import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react';
import type { Todo, View } from '../types';
import { useAuth } from './AuthContext';
import { createTodo, deleteTodo, fetchTodos, updateTodo, type NewTodoInput } from '../lib/todosApi';
import { initialState, todoReducer } from './todoReducer';

interface TodoContextValue {
  todos: Todo[];
  view: View;
  loading: boolean;
  error: string | null;
  addTodo: (input: NewTodoInput) => Promise<void>;
  toggleTodo: (todo: Todo) => Promise<void>;
  editTodo: (id: string, patch: Partial<Pick<Todo, 'title' | 'priority' | 'dueDate'>>) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  setView: (view: View) => void;
}

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 사용자가 바뀌면 그 사용자의 할 일을 불러온다.
  useEffect(() => {
    if (!user) {
      dispatch({ type: 'SET', todos: [] });
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchTodos()
      .then((todos) => {
        if (!cancelled) dispatch({ type: 'SET', todos });
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : '불러오기 실패');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function addTodo(input: NewTodoInput) {
    if (!input.title.trim()) return;
    try {
      const todo = await createTodo(input);
      dispatch({ type: 'UPSERT', todo });
    } catch (e) {
      setError(e instanceof Error ? e.message : '추가 실패');
    }
  }

  async function toggleTodo(todo: Todo) {
    const next = !todo.done;
    try {
      const updated = await updateTodo(todo.id, {
        done: next,
        completedAt: next ? new Date().toISOString() : undefined,
      });
      dispatch({ type: 'UPSERT', todo: updated });
    } catch (e) {
      setError(e instanceof Error ? e.message : '변경 실패');
    }
  }

  async function editTodo(
    id: string,
    patch: Partial<Pick<Todo, 'title' | 'priority' | 'dueDate'>>,
  ) {
    try {
      const updated = await updateTodo(id, patch);
      dispatch({ type: 'UPSERT', todo: updated });
    } catch (e) {
      setError(e instanceof Error ? e.message : '수정 실패');
    }
  }

  async function removeTodo(id: string) {
    try {
      await deleteTodo(id);
      dispatch({ type: 'REMOVE', id });
    } catch (e) {
      setError(e instanceof Error ? e.message : '삭제 실패');
    }
  }

  function setView(view: View) {
    dispatch({ type: 'SET_VIEW', view });
  }

  return (
    <TodoContext.Provider
      value={{ todos: state.todos, view: state.view, loading, error, addTodo, toggleTodo, editTodo, removeTodo, setView }}
    >
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
