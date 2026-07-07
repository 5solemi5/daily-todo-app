import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { TodoProvider } from './store/TodoContext';

function renderApp() {
  return render(
    <TodoProvider>
      <App />
    </TodoProvider>,
  );
}

describe('App (smoke)', () => {
  beforeEach(() => localStorage.clear());

  it('renders the app title', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: '오늘의 할 일' })).toBeInTheDocument();
  });

  it('renders the quick-add input', () => {
    renderApp();
    expect(screen.getByLabelText('할 일 입력')).toBeInTheDocument();
  });
});
