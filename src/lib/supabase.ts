import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** 환경변수가 설정돼 있는지 (미설정 시 로그인 화면에서 안내). */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Supabase 클라이언트. 환경변수가 없으면 null 이며, UI 는 설정 안내를 보여준다.
 * (빈 값으로 createClient 를 호출하면 런타임 오류가 나므로 방어한다.)
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
