export type UserRole = 'admin' | 'moderator' | 'teacher' | 'contributor' | 'student';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export const ROLES: Record<string, UserRole> = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  TEACHER: 'teacher',
  CONTRIBUTOR: 'contributor',
  STUDENT: 'student',
};

// Permission Hierarchy & Helpers
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  if (userRole === 'admin') return true; // Admin has full access
  return requiredRoles.includes(userRole);
}

export function canReviewQuestions(userRole: UserRole): boolean {
  return hasRole(userRole, ['admin', 'moderator']);
}

export function canManageTaxonomy(userRole: UserRole): boolean {
  return hasRole(userRole, ['admin', 'moderator', 'teacher']);
}

export function canManageAdmissions(userRole: UserRole): boolean {
  return hasRole(userRole, ['admin', 'moderator']);
}

export function canEditQuestion(user: AuthUser, questionContributorId?: number): boolean {
  if (user.role === 'admin' || user.role === 'moderator') return true;
  if (user.role === 'contributor' || user.role === 'teacher') {
    return questionContributorId ? user.id === questionContributorId : true;
  }
  return false;
}

// In-memory/cookie session helper token generator
export function createSessionToken(user: AuthUser): string {
  const payload = JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return Buffer.from(payload).toString('base64');
}

export function parseSessionToken(token: string): AuthUser | null {
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(jsonStr);
    if (data.exp && data.exp < Date.now()) {
      return null;
    }
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
  } catch {
    return null;
  }
}

export function getAuthUserFromRequest(req: Request): AuthUser | null {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/qb_session=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token) return null;
  return parseSessionToken(token);
}

export const getCurrentUser = getAuthUserFromRequest;
