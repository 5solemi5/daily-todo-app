import { useMemo } from 'react';
import QuickAdd from './components/QuickAdd';
import TodoList from './components/TodoList';
import ViewTabs from './components/ViewTabs';
import Login from './components/Login';
import { useAuth } from './store/AuthContext';
import { useTodos } from './store/TodoContext';
import { filterAndSort, viewCounts } from './lib/filters';
import { todayStr } from './lib/date';

function TodoApp() {
  const { user, signOut } = useAuth();
  const { todos, view, loading, error } = useTodos();
  const today = todayStr();

  const counts = useMemo(() => viewCounts(todos, today), [todos, today]);
  const visible = useMemo(() => filterAndSort(todos, view, today), [todos, view, today]);

  const name =
    (user?.user_metadata?.user_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email ??
    '나';

  return (
    <main className="app">
      <header className="app-header">
        <h1>오늘의 할 일</h1>
        <div className="app-user">
          <span className="app-user-name">{name}</span>
          <button className="logout-btn" onClick={() => void signOut()}>
            로그아웃
          </button>
        </div>
      </header>
      <ViewTabs counts={counts} />
      <QuickAdd />
      {error && <p className="app-error">⚠️ {error}</p>}
      {loading ? <p className="muted">불러오는 중…</p> : <TodoList todos={visible} />}
    </main>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="center-screen">
        <p className="muted">불러오는 중…</p>
      </div>
    );
  }

  return user ? <TodoApp /> : <Login />;
}
