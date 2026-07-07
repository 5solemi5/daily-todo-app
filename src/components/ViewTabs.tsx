import type { View } from '../types';
import { useTodos } from '../store/TodoContext';

const TABS: { value: View; label: string }[] = [
  { value: 'today', label: '오늘' },
  { value: 'upcoming', label: '예정' },
  { value: 'done', label: '완료' },
];

export default function ViewTabs({ counts }: { counts: Record<View, number> }) {
  const { view, dispatch } = useTodos();

  return (
    <div className="tabs" role="tablist" aria-label="할 일 보기">
      {TABS.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={view === t.value}
          className={`tab ${view === t.value ? 'on' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', view: t.value })}
        >
          {t.label}
          <span className="tab-count">{counts[t.value]}</span>
        </button>
      ))}
    </div>
  );
}
