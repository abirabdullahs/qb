import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { parseSessionToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('qb_session')?.value;
  if (!token) {
    return apiError('Unauthorized', 401);
  }

  const user = parseSessionToken(token);
  if (!user) {
    return apiError('Invalid or expired session', 401);
  }

  return apiSuccess({ user });
}
