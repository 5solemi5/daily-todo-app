import { describe, it, expect } from 'vitest';
import { initialState, todoReducer } from './todoReducer';
import type { Todo } from '../types';

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: 't1',
    title: '샘플',
    done: false,
    priority: 'normal',
    createdAt: '2026-07-07T00:00:00.000Z',
    ...overrides,
  };
}

describe('todoReducer (server-backed)', () => {
  it('SET 은 목록을 통째로 교체한다', () => {
    const s = todoReducer(initialState, {
      type: 'SET',
      todos: [makeTodo(), makeTodo({ id: 't2' })],
    });
    expect(s.todos).toHaveLength(2);
  });

  it('UPSERT 는 새 항목을 추가한다', () => {
    const s = todoReducer(initialState, { type: 'UPSERT', todo: makeTodo() });
    expect(s.todos).toHaveLength(1);
    expect(s.todos[0].id).toBe('t1');
  });

  it('UPSERT 는 기존 항목을 같은 위치에서 갱신한다', () => {
    const start = { ...initialState, todos: [makeTodo(), makeTodo({ id: 't2' })] };
    const s = todoReducer(start, {
      type: 'UPSERT',
      todo: makeTodo({ id: 't2', title: '수정됨', done: true }),
    });
    expect(s.todos).toHaveLength(2);
    expect(s.todos[1].title).toBe('수정됨');
    expect(s.todos[1].done).toBe(true);
  });

  it('REMOVE 는 항목을 제거한다', () => {
    const start = { ...initialState, todos: [makeTodo(), makeTodo({ id: 't2' })] };
    const s = todoReducer(start, { type: 'REMOVE', id: 't1' });
    expect(s.todos.map((t) => t.id)).toEqual(['t2']);
  });

  it('SET_VIEW 는 현재 뷰를 바꾼다', () => {
    const s = todoReducer(initialState, { type: 'SET_VIEW', view: 'done' });
    expect(s.view).toBe('done');
  });
});
