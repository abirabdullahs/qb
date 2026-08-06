import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { registerUser } from '@/domains/auth/service';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return apiError('Name, email, and password are required', 400);
    }

    if (password.length < 6) {
      return apiError('Password must be at least 6 characters', 400);
    }

    const { user, token } = await registerUser(name, email, password, 'student');

    const response = apiSuccess({ user, token }, 'Registration successful', 201);
    response.cookies.set('qb_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    if (err.message === 'USER_EXISTS') {
      return apiError('User with this email already exists', 409);
    }
    if (err.message === 'DATABASE_ERROR') {
      return apiError('Service temporarily unavailable, please try again shortly', 503);
    }
    return apiError('Registration failed', 500);
  }
}
