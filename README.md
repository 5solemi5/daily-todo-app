# 오늘의 할 일 (daily-todo-app)

미니멀 데일리 투두 앱. React + TypeScript + Vite, 인증·데이터는 Supabase(로그인 필수·RLS).

**라이브**: https://daily-todo-app-sable.vercel.app

## 기능
- GitHub OAuth 로그인 (Supabase Auth)
- 할 일 추가 / 완료 토글 / 삭제
- 오늘 · 예정 · 완료 뷰 (우선순위·마감일 기준 정렬)
- 우선순위(높음/보통/낮음), 마감일(선택)
- Row Level Security 로 "내 데이터만" 접근

## 개발 세팅

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

### 환경변수 (`.env.local`)
```
VITE_SUPABASE_URL=https://YOUR-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
```
Supabase 대시보드 → **Settings → API** 에서 복사.

## Supabase 설정
1. supabase.com 에서 새 프로젝트 생성
2. **SQL Editor** 에서 [`supabase/schema.sql`](./supabase/schema.sql) 실행 (todos 테이블 + RLS)
3. **Authentication → Providers → GitHub** 활성화
   - GitHub OAuth App 생성 (callback: `https://YOUR-REF.supabase.co/auth/v1/callback`)
   - Client ID / Secret 등록
4. **Authentication → URL Configuration** 에 앱 URL(로컬·배포) 추가

## 스크립트
| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입체크 + 프로덕션 빌드 |
| `npm test` | 유닛 테스트 (Vitest) |

## 배포 (Vercel)
Vercel 프로젝트 환경변수에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 등록 후 배포.
