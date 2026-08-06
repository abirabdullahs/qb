import bcrypt from 'bcryptjs';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { AuthUser, UserRole, createSessionToken } from '@/lib/auth';

export async function loginUser(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  let dbUser = null;
  try {
    const found = await db.select().from(users).where(eq(users.email, normalizedEmail));
    if (found && found.length > 0) {
      dbUser = found[0];
    }
  } catch (err) {
    console.error('Database error during login:', err);
    throw new Error('DATABASE_ERROR');
  }

  if (!dbUser || !dbUser.passwordHash) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
  if (!isMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const user: AuthUser = {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email || normalizedEmail,
    role: (dbUser.role as UserRole) || 'contributor',
  };

  const token = createSessionToken(user);
  return { user, token };
}

export async function registerUser(name: string, email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  // Role is strictly hardcoded to 'contributor' server-side
  const role: UserRole = 'contributor';

  try {
    const existing = await db.select().from(users).where(eq(users.email, normalizedEmail));
    if (existing && existing.length > 0) {
      throw new Error('USER_EXISTS');
    }
  } catch (err: any) {
    if (err.message === 'USER_EXISTS') throw err;
    console.error('Database error checking existing user during register:', err);
    throw new Error('DATABASE_ERROR');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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
      const dbUser = inserted[0];
      const user: AuthUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email || normalizedEmail,
        role: (dbUser.role as UserRole) || 'contributor',
      };
      const token = createSessionToken(user);
      return { user, token };
    }
    throw new Error('DATABASE_ERROR');
  } catch (err: any) {
    console.error('Database error inserting user during register:', err);
    throw new Error('DATABASE_ERROR');
  }
}
