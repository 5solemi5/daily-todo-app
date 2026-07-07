-- ============================================================
--  daily-todo-app — Supabase schema + Row Level Security (RLS)
--  Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
-- ============================================================

-- 1) todos 테이블
create table if not exists public.todos (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  title        text        not null check (char_length(title) between 1 and 500),
  done         boolean     not null default false,
  priority     text        not null default 'normal' check (priority in ('high', 'normal', 'low')),
  due_date     date,
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);

-- 자주 쓰는 조회(내 할 일 최신순) 인덱스
create index if not exists todos_user_created_idx
  on public.todos (user_id, created_at desc);

-- 2) Row Level Security 활성화
alter table public.todos enable row level security;

-- 3) 정책: 로그인한 사용자는 "자기 행"만 접근
--    (auth.uid() = 현재 로그인 사용자 id)

drop policy if exists "select own todos" on public.todos;
create policy "select own todos"
  on public.todos for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "insert own todos" on public.todos;
create policy "insert own todos"
  on public.todos for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "update own todos" on public.todos;
create policy "update own todos"
  on public.todos for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "delete own todos" on public.todos;
create policy "delete own todos"
  on public.todos for delete
  to authenticated
  using (auth.uid() = user_id);
