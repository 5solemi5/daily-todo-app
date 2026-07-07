import type { Todo, TodoState, View } from '../types';

// 서버(Supabase)가 진실의 원천이므로, 리듀서는 서버 결과를 로컬에 반영만 한다.
export type Action =
  | { type: 'SET'; todos: Todo[] } // 전체 교체 (fetch 결과)
  | { type: 'UPSERT'; todo: Todo } // 추가/수정된 한 건 반영
  | { type: 'REMOVE'; id: string } // 삭제 반영
  | { type: 'SET_VIEW'; view: View };

export const initialState: TodoState = {
  todos: [],
  view: 'today',
};

export function todoReducer(state: TodoState, action: Action): TodoState {
  switch (action.type) {
    case 'SET': {
      return { ...state, todos: action.todos };
    }
    case 'UPSERT': {
      const exists = state.todos.some((t) => t.id === action.todo.id);
      return {
        ...state,
        todos: exists
          ? state.todos.map((t) => (t.id === action.todo.id ? action.todo : t))
          : [...state.todos, action.todo],
      };
    }
    case 'REMOVE': {
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };
    }
    case 'SET_VIEW': {
      return { ...state, view: action.view };
    }
    default:
      return state;
  }
}
