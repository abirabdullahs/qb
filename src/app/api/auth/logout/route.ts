import { apiSuccess } from '@/lib/api-response';

export async function POST() {
  const response = apiSuccess(null, 'Logged out successfully');
  response.cookies.delete('qb_session');
  return response;
}
