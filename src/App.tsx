import { useMemo } from 'react';
import QuickAdd from './components/QuickAdd';
import TodoList from './components/TodoList';
import ViewTabs from './components/ViewTabs';
import { useTodos } from './store/TodoContext';
import { filterAndSort, viewCounts } from './lib/filters';
import { todayStr } from './lib/date';

export default function App() {
  const { todos, view } = useTodos();
  const today = todayStr();

  const counts = useMemo(() => viewCounts(todos, today), [todos, today]);
  const visible = useMemo(() => filterAndSort(todos, view, today), [todos, view, today]);

  return (
    <main className="app">
      <header className="app-header">
        <h1>오늘의 할 일</h1>
      </header>
      <ViewTabs counts={counts} />
      <QuickAdd />
      <TodoList todos={visible} />
    </main>
  );
}
