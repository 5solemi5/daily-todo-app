import { describe, it, expect } from 'vitest';
import { filterAndSort, viewCounts } from './filters';
import type { Todo } from '../types';

const TODAY = '2026-07-07';

function todo(p: Partial<Todo>): Todo {
  return {
    id: Math.random().toString(36).slice(2),
    title: 't',
    done: false,
    priority: 'normal',
    createdAt: '2026-07-01T00:00:00.000Z',
    ...p,
  };
}

describe('filterAndSort — today', () => {
  it('마감일 없음/오늘/지난 미완료를 포함하고, 미래·완료는 제외', () => {
    const list = [
      todo({ id: 'a', dueDate: undefined }),
      todo({ id: 'b', dueDate: TODAY }),
      todo({ id: 'c', dueDate: '2026-07-05' }), // 지남
      todo({ id: 'd', dueDate: '2026-07-10' }), // 미래 → 제외
      todo({ id: 'e', done: true }), // 완료 → 제외
    ];
    const ids = filterAndSort(list, 'today', TODAY).map((t) => t.id);
    expect(ids).toContain('a');
    expect(ids).toContain('b');
    expect(ids).toContain('c');
    expect(ids).not.toContain('d');
    expect(ids).not.toContain('e');
  });

  it('우선순위(높음→낮음) 후 생성순으로 정렬', () => {
    const list = [
      todo({ id: 'low', priority: 'low', createdAt: '2026-07-01T00:00:00Z' }),
      todo({ id: 'high', priority: 'high', createdAt: '2026-07-02T00:00:00Z' }),
      todo({ id: 'normal1', priority: 'normal', createdAt: '2026-07-01T00:00:00Z' }),
      todo({ id: 'normal2', priority: 'normal', createdAt: '2026-07-03T00:00:00Z' }),
    ];
    const ids = filterAndSort(list, 'today', TODAY).map((t) => t.id);
    expect(ids).toEqual(['high', 'normal1', 'normal2', 'low']);
  });
});

describe('filterAndSort — upcoming', () => {
  it('미래 마감 미완료만, 마감일 오름차순', () => {
    const list = [
      todo({ id: 'far', dueDate: '2026-07-20' }),
      todo({ id: 'soon', dueDate: '2026-07-08' }),
      todo({ id: 'today', dueDate: TODAY }), // 오늘 → 제외
      todo({ id: 'none' }), // 마감 없음 → 제외
    ];
    const ids = filterAndSort(list, 'upcoming', TODAY).map((t) => t.id);
    expect(ids).toEqual(['soon', 'far']);
  });
});

describe('filterAndSort — done', () => {
  it('완료만, 완료 시각 내림차순', () => {
    const list = [
      todo({ id: 'old', done: true, completedAt: '2026-07-05T10:00:00Z' }),
      todo({ id: 'new', done: true, completedAt: '2026-07-07T10:00:00Z' }),
      todo({ id: 'active' }),
    ];
    const ids = filterAndSort(list, 'done', TODAY).map((t) => t.id);
    expect(ids).toEqual(['new', 'old']);
  });
});

describe('viewCounts', () => {
  it('뷰별 개수를 정확히 센다', () => {
    const list = [
      todo({ dueDate: undefined }), // today
      todo({ dueDate: '2026-07-10' }), // upcoming
      todo({ done: true, completedAt: '2026-07-06T00:00:00Z' }), // done
    ];
    expect(viewCounts(list, TODAY)).toEqual({ today: 1, upcoming: 1, done: 1 });
  });
});
