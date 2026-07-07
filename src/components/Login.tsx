import { useAuth } from '../store/AuthContext';

export default function Login() {
  const { signInWithGitHub, configured } = useAuth();

  return (
    <div className="login">
      <div className="login-card">
        <h1 className="login-title">오늘의 할 일</h1>
        <p className="login-sub">로그인하고 어디서든 내 할 일을 관리하세요.</p>

        {configured ? (
          <button className="login-btn" onClick={() => void signInWithGitHub()}>
            <span className="gh-mark" aria-hidden>
              ⌘
            </span>
            GitHub로 계속하기
          </button>
        ) : (
          <p className="login-warn">
            ⚠️ Supabase 환경변수가 설정되지 않았습니다.
            <br />
            <code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>를 설정해주세요.
          </p>
        )}
      </div>
    </div>
  );
}
