import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { AuthProvider } from './store/AuthContext';
import { TodoProvider } from './store/TodoContext';

function renderApp() {
  return render(
    <AuthProvider>
      <TodoProvider>
        <App />
      </TodoProvider>
    </AuthProvider>,
  );
}

// 테스트 환경엔 Supabase 환경변수가 없으므로 로그인 화면이 렌더된다.
describe('App (smoke, unauthenticated)', () => {
  it('로그인 화면 제목을 보여준다', async () => {
    renderApp();
    expect(await screen.findByRole('heading', { name: '오늘의 할 일' })).toBeInTheDocument();
  });

  it('Supabase 미설정 시 환경변수 안내를 보여준다', async () => {
    renderApp();
    expect(await screen.findByText(/환경변수가 설정되지 않았습니다/)).toBeInTheDocument();
  });
});
