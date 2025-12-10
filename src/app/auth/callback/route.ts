import { createBrowserClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const next = searchParams.get('next') ?? '/';

  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?error=${encodeURIComponent(
        error
      )}&description=${encodeURIComponent(errorDescription || '')}`
    );
  }

  if (code) {
    try {
      const cookieStore = await cookies();
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: '', ...options });
            },
          },
        }
      );

      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error('Code exchange error:', exchangeError.message);
        return NextResponse.redirect(
          `${origin}/auth/auth-code-error?error=exchange_failed&description=${encodeURIComponent(
            exchangeError.message
          )}`
        );
      }

      return NextResponse.redirect(`${origin}${next}`);
    } catch (err) {
      console.error('Auth callback exception:', err);
      return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=server_error&description=${encodeURIComponent(
          err instanceof Error ? err.message : 'Unknown error'
        )}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`);
}
