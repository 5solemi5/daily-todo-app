/** 로컬 기준 오늘 날짜를 YYYY-MM-DD 로 반환한다. */
export function todayStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 주어진 YYYY-MM-DD 에서 offset 일 만큼 이동한 날짜 문자열. */
export function addDays(dateStr: string, offset: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + offset);
  return todayStr(dt);
}

export type DueStatus = 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'none';

/** 마감일이 오늘(today) 대비 어떤 상태인지 분류한다. */
export function dueStatus(dueDate: string | undefined, today: string = todayStr()): DueStatus {
  if (!dueDate) return 'none';
  if (dueDate < today) return 'overdue';
  if (dueDate === today) return 'today';
  if (dueDate === addDays(today, 1)) return 'tomorrow';
  return 'upcoming';
}
