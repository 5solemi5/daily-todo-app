import { useRef, useState } from 'react';
import type { Priority } from '../types';
import { useTodos } from '../store/TodoContext';

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'high', label: '높음' },
  { value: 'normal', label: '보통' },
  { value: 'low', label: '낮음' },
];

export default function QuickAdd() {
  const { dispatch } = useTodos();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [dueDate, setDueDate] = useState('');
  const composing = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    if (!title.trim()) return;
    dispatch({ type: 'ADD', title, priority, dueDate: dueDate || undefined });
    setTitle('');
    setDueDate('');
    // keep priority as-is for quick repeated entry (P5: 연속 등록)
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // 한글 IME 조합 중 Enter 는 무시 (D: 엣지 케이스)
    if (e.key === 'Enter' && !composing.current && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="quickadd">
      <div className="quickadd-row">
        <input
          ref={inputRef}
          className="quickadd-input"
          type="text"
          value={title}
          placeholder="할 일을 입력하세요…"
          aria-label="할 일 입력"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={onKeyDown}
          onCompositionStart={() => (composing.current = true)}
          onCompositionEnd={() => (composing.current = false)}
        />
        <button className="quickadd-btn" onClick={submit} aria-label="할 일 추가">
          추가
        </button>
      </div>
      <div className="quickadd-opts">
        <div className="prio-chips" role="group" aria-label="우선순위 선택">
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              className={`chip chip-${p.value} ${priority === p.value ? 'on' : ''}`}
              aria-pressed={priority === p.value}
              onClick={() => setPriority(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <input
          className="quickadd-date"
          type="date"
          value={dueDate}
          aria-label="마감일 (선택)"
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
    </div>
  );
}
