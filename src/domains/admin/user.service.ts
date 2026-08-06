import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { UserRole } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export interface AdminUserItem {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string | Date;
}

function getGlobalMockUsers(): any[] {
  if (!(globalThis as any)._mockUsersStore) {
    (globalThis as any)._mockUsersStore = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: '$2a$10$i3Lll/I4D2n7aTjJj0R2e.sMvI5lK.R2N0y23lC9vM2y2gq1K2f6',
        role: 'admin',
        createdAt: new Date(),
      },
      {
        id: 2,
        name: 'Contributor User',
        email: 'user@example.com',
        passwordHash: '$2a$10$i3Lll/I4D2n7aTjJj0R2e.sMvI5lK.R2N0y23lC9vM2y2gq1K2f6',
        role: 'contributor',
        createdAt: new Date(),
      },
    ];
  }
  return (globalThis as any)._mockUsersStore;
}

export async function getAllUsers(): Promise<AdminUserItem[]> {
  try {
    const dbUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    if (dbUsers && dbUsers.length > 0) {
      return dbUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role as UserRole,
        createdAt: u.createdAt,
      }));
    }
  } catch (err) {
    console.error('Error fetching users from DB:', err);
  }

  const mocks = getGlobalMockUsers();
  return mocks.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role,
    createdAt: m.createdAt || new Date().toISOString(),
  }));
}

export async function createStaffAccount(
  name: string,
  email: string,
  password: string,
  role: UserRole = 'contributor'
): Promise<AdminUserItem> {
  const normalizedEmail = email.trim().toLowerCase();
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check existing
  const mocks = getGlobalMockUsers();
  if (mocks.some((u) => u.email === normalizedEmail)) {
    throw new Error('USER_EXISTS');
  }

  try {
    const existing = await db.select().from(users).where(eq(users.email, normalizedEmail));
    if (existing && existing.length > 0) {
      throw new Error('USER_EXISTS');
    }
  } catch (err: any) {
    if (err.message === 'USER_EXISTS') throw err;
  }

  let newUser: AdminUserItem | null = null;
  try {
    const inserted = await db
      .insert(users)
      .values({
        name,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role,
      })
      .returning();

    if (inserted && inserted[0]) {
      const u = inserted[0];
      newUser = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role as UserRole,
        createdAt: u.createdAt,
      };
    }
  } catch (err) {
    console.error('Failed inserting user in DB, using mock store:', err);
  }

  if (!newUser) {
    const mockUser = {
      id: Date.now(),
      name,
      email: normalizedEmail,
      passwordHash: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };
    mocks.push(mockUser);
    newUser = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role as UserRole,
      createdAt: mockUser.createdAt,
    };
  } else {
    mocks.push({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      passwordHash: hashedPassword,
      role: newUser.role,
      createdAt: newUser.createdAt,
    });
  }

  return newUser;
}

export async function updateUserRole(userId: number, role: UserRole): Promise<boolean> {
  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));
  } catch {}

  const mocks = getGlobalMockUsers();
  const found = mocks.find((u) => u.id === userId);
  if (found) {
    found.role = role;
  }
  return true;
}
