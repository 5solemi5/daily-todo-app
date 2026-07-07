import type { Todo } from '../types';
import TodoItem from './TodoItem';

export default function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul className="list">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} />
      ))}
    </ul>
  );
}
