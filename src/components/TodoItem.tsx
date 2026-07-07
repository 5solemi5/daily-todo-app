import type { Todo } from '../types';
import { useTodos } from '../store/TodoContext';

const PRIO_LABEL: Record<Todo['priority'], string> = {
  high: '높음',
  normal: '보통',
  low: '낮음',
};

export default function TodoItem({ todo }: { todo: Todo }) {
  const { toggleTodo, removeTodo } = useTodos();

  return (
    <li className={`item ${todo.done ? 'done' : ''}`}>
      <button
        type="button"
        className="item-check"
        role="checkbox"
        aria-checked={todo.done}
        aria-label={todo.done ? '완료 취소' : '완료로 표시'}
        onClick={() => void toggleTodo(todo)}
      >
        {todo.done ? '✓' : ''}
      </button>
      <span className="item-title">{todo.title}</span>
      {!todo.done && todo.priority === 'high' && (
        <span className="item-badge prio-high-badge">{PRIO_LABEL.high}</span>
      )}
      {todo.dueDate && <span className="item-due">{todo.dueDate}</span>}
      <button
        type="button"
        className="item-delete"
        aria-label="삭제"
        title="삭제"
        onClick={() => void removeTodo(todo.id)}
      >
        ×
      </button>
    </li>
  );
}
