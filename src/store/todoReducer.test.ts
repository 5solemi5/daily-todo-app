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

describe('todoReducer', () => {
  it('ADD 는 새 항목을 추가한다', () => {
    const s = todoReducer(initialState, { type: 'ADD', title: '보고서 초안' });
    expect(s.todos).toHaveLength(1);
    expect(s.todos[0].title).toBe('보고서 초안');
    expect(s.todos[0].done).toBe(false);
    expect(s.todos[0].priority).toBe('normal');
  });

  it('ADD 는 우선순위와 마감일을 반영한다', () => {
    const s = todoReducer(initialState, {
      type: 'ADD',
      title: '과제',
      priority: 'high',
      dueDate: '2026-07-10',
    });
    expect(s.todos[0].priority).toBe('high');
    expect(s.todos[0].dueDate).toBe('2026-07-10');
  });

  it('ADD 는 공백만 있는 입력을 무시한다', () => {
    const s = todoReducer(initialState, { type: 'ADD', title: '   ' });
    expect(s.todos).toHaveLength(0);
  });

  it('ADD 는 제목 앞뒤 공백을 제거한다', () => {
    const s = todoReducer(initialState, { type: 'ADD', title: '  청소  ' });
    expect(s.todos[0].title).toBe('청소');
  });

  it('TOGGLE 은 완료 상태를 전환하고 completedAt 을 설정/해제한다', () => {
    const start = { ...initialState, todos: [makeTodo()] };
    const done = todoReducer(start, { type: 'TOGGLE', id: 't1' });
    expect(done.todos[0].done).toBe(true);
    expect(done.todos[0].completedAt).toBeTruthy();

    const undone = todoReducer(done, { type: 'TOGGLE', id: 't1' });
    expect(undone.todos[0].done).toBe(false);
    expect(undone.todos[0].completedAt).toBeUndefined();
  });

  it('EDIT 는 제목/우선순위/마감일을 수정한다', () => {
    const start = { ...initialState, todos: [makeTodo()] };
    const s = todoReducer(start, {
      type: 'EDIT',
      id: 't1',
      patch: { title: '수정됨', priority: 'high' },
    });
    expect(s.todos[0].title).toBe('수정됨');
    expect(s.todos[0].priority).toBe('high');
  });

  it('EDIT 는 빈 제목으로 덮어쓰지 않는다', () => {
    const start = { ...initialState, todos: [makeTodo({ title: '원본' })] };
    const s = todoReducer(start, { type: 'EDIT', id: 't1', patch: { title: '  ' } });
    expect(s.todos[0].title).toBe('원본');
  });

  it('DELETE 는 항목을 제거한다', () => {
    const start = { ...initialState, todos: [makeTodo()] };
    const s = todoReducer(start, { type: 'DELETE', id: 't1' });
    expect(s.todos).toHaveLength(0);
  });

  it('SET_VIEW 는 현재 뷰를 바꾼다', () => {
    const s = todoReducer(initialState, { type: 'SET_VIEW', view: 'done' });
    expect(s.view).toBe('done');
  });

  it('HYDRATE 는 저장된 목록을 복원한다', () => {
    const s = todoReducer(initialState, { type: 'HYDRATE', todos: [makeTodo(), makeTodo({ id: 't2' })] });
    expect(s.todos).toHaveLength(2);
  });
});
