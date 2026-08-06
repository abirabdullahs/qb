import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { apiError, apiSuccess } from '@/lib/api-response';
import { getAllUsers, createStaffAccount, updateUserRole } from '@/domains/admin/user.service';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== 'admin') {
    return apiError('Unauthorized: Admin access required', 403);
  }

  try {
    const list = await getAllUsers();
    return apiSuccess(list, 'Users fetched successfully');
  } catch (err: any) {
    return apiError(err.message || 'Failed to fetch users', 500);
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== 'admin') {
    return apiError('Unauthorized: Admin access required', 403);
  }

  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return apiError('Name, email, password, and role are required', 400);
    }

    if (password.length < 6) {
      return apiError('Password must be at least 6 characters long', 400);
    }

    const created = await createStaffAccount(name, email, password, role);
    return apiSuccess(created, 'Staff account created successfully', 201);
  } catch (err: any) {
    if (err.message === 'USER_EXISTS') {
      return apiError('A user with this email address already exists', 409);
    }
    return apiError(err.message || 'Failed to create staff account', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user || user.role !== 'admin') {
    return apiError('Unauthorized: Admin access required', 403);
  }

  try {
    const { userId, role } = await req.json();
    if (!userId || !role) {
      return apiError('userId and role are required', 400);
    }

    await updateUserRole(userId, role);
    return apiSuccess({ success: true }, 'User role updated');
  } catch (err: any) {
    return apiError(err.message || 'Failed to update user role', 500);
  }
}
