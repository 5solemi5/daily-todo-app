import type { Priority, Todo, View } from '../types';
import { todayStr } from './date';

const PRIORITY_RANK: Record<Priority, number> = { high: 0, normal: 1, low: 2 };

function byPriorityThenCreated(a: Todo, b: Todo): number {
  const p = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  if (p !== 0) return p;
  return a.createdAt.localeCompare(b.createdAt); // 생성순 오름차순
}

/** 뷰에 맞게 todos 를 필터링·정렬한 새 배열을 반환한다 (원본 불변). */
export function filterAndSort(todos: Todo[], view: View, today: string = todayStr()): Todo[] {
  switch (view) {
    case 'today': {
      // 미완료 & (마감일 없음 || 오늘 이하[오늘·지남])
      return todos
        .filter((t) => !t.done && (!t.dueDate || t.dueDate <= today))
        .sort(byPriorityThenCreated);
    }
    case 'upcoming': {
      // 미완료 & 마감일이 미래
      return todos
        .filter((t) => !t.done && t.dueDate && t.dueDate > today)
        .sort((a, b) => {
          const d = (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
          return d !== 0 ? d : byPriorityThenCreated(a, b);
        });
    }
    case 'done': {
      // 완료 & 완료 시각 내림차순
      return todos
        .filter((t) => t.done)
        .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));
    }
    default:
      return todos;
  }
}

/** 각 뷰의 개수를 계산한다 (탭 뱃지용). */
export function viewCounts(todos: Todo[], today: string = todayStr()) {
  return {
    today: filterAndSort(todos, 'today', today).length,
    upcoming: filterAndSort(todos, 'upcoming', today).length,
    done: filterAndSort(todos, 'done', today).length,
  };
}
