import type { Priority, Todo } from '../types';
import { supabase } from './supabase';

/** DB row (snake_case) shape returned from Supabase. */
interface TodoRow {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface NewTodoInput {
  title: string;
  priority?: Priority;
  dueDate?: string;
}

function rowToTodo(r: TodoRow): Todo {
  return {
    id: r.id,
    title: r.title,
    done: r.done,
    priority: r.priority,
    dueDate: r.due_date ?? undefined,
    createdAt: r.created_at,
    completedAt: r.completed_at ?? undefined,
  };
}

function client() {
  if (!supabase) throw new Error('Supabase 가 설정되지 않았습니다 (환경변수 확인).');
  return supabase;
}

/** 로그인 사용자의 모든 할 일을 불러온다 (RLS 로 자동 필터). */
export async function fetchTodos(): Promise<Todo[]> {
  const { data, error } = await client()
    .from('todos')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data as TodoRow[]).map(rowToTodo);
}

/** 새 할 일을 만든다. user_id 는 DB 기본값 auth.uid() 로 채워진다. */
export async function createTodo(input: NewTodoInput): Promise<Todo> {
  const { data, error } = await client()
    .from('todos')
    .insert({
      title: input.title.trim(),
      priority: input.priority ?? 'normal',
      due_date: input.dueDate || null,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToTodo(data as TodoRow);
}

/** 할 일의 일부 필드를 수정한다. */
export async function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, 'title' | 'priority' | 'dueDate' | 'done' | 'completedAt'>>,
): Promise<Todo> {
  const dbPatch: Record<string, unknown> = {};
  if (patch.title !== undefined) dbPatch.title = patch.title;
  if (patch.priority !== undefined) dbPatch.priority = patch.priority;
  if (patch.dueDate !== undefined) dbPatch.due_date = patch.dueDate || null;
  if (patch.done !== undefined) dbPatch.done = patch.done;
  if (patch.completedAt !== undefined) dbPatch.completed_at = patch.completedAt ?? null;

  const { data, error } = await client()
    .from('todos')
    .update(dbPatch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return rowToTodo(data as TodoRow);
}

/** 할 일을 삭제한다. */
export async function deleteTodo(id: string): Promise<void> {
  const { error } = await client().from('todos').delete().eq('id', id);
  if (error) throw error;
}
