import { createServerClient } from '@/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  // Handle OAuth error from provider
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
      const supabase = createServerClient();
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

  // No code and no error - unexpected state
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`);
}
