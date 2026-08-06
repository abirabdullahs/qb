import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { loginUser } from '@/domains/auth/service';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return apiError('Email and password are required', 400);
    }

    const { user, token } = await loginUser(email, password);

    const response = apiSuccess({ user, token }, 'Login successful');
    response.cookies.set('qb_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return apiError('Invalid email or password', 401);
    }
    if (err.message === 'DATABASE_ERROR') {
      return apiError('Service temporarily unavailable, please try again shortly', 503);
    }
    return apiError('Login failed', 500);
  }
}
