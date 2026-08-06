import bcrypt from 'bcryptjs';
import { db } from './client';
import { users, segments, admissionSegments, boards, institutes, admissionExams, admissionUnits, subjects } from './schema';
import { eq } from 'drizzle-orm';

export const initialAdminUser = {
  name: 'System Admin',
  email: 'admin@example.com',
  passwordHash: bcrypt.hashSync('admin123', 10),
  role: 'admin',
};

export const initialSegments = [
  { name: 'SSC', code: 'SSC', segmentKind: 'academic' },
  { name: 'HSC', code: 'HSC', segmentKind: 'academic' },
  { name: 'Admission', code: 'ADM', segmentKind: 'admission' },
];

export const initialAdmissionSegments = [
  { name: 'Engineering', code: 'ENG' },
  { name: 'Medical', code: 'MED' },
  { name: 'Varsity', code: 'VAR' },
];

export const initialBoards = [
  { name: 'ঢাকা', code: 'DHK' },
  { name: 'রাজশাহী', code: 'RAJ' },
  { name: 'কুমিল্লা', code: 'CUM' },
  { name: 'যশোর', code: 'JES' },
  { name: 'চট্টগ্রাম', code: 'CHT' },
  { name: 'বরিশাল', code: 'BAR' },
  { name: 'সিলেট', code: 'SYL' },
  { name: 'দিনাজপুর', code: 'DIN' },
  { name: 'ময়মনসিংহ', code: 'MYM' },
  { name: 'মাদ্রাসা', code: 'MAD' },
  { name: 'কারিগরি', code: 'TEC' },
];

export const initialSubjects = [
  { name: 'পদার্থবিজ্ঞান', code: 'PHY' },
  { name: 'রসায়ন', code: 'CHE' },
  { name: 'উচ্চতর গণিত', code: 'HMT' },
  { name: 'জীববিজ্ঞান', code: 'BIO' },
  { name: 'বাংলা', code: 'BAN' },
  { name: 'English', code: 'ENG' },
];

export async function seedDatabase() {
  console.log('Starting seed process...');
  try {
    // Seed initial admin user if not exists
    const existingAdmin = await db.select?.().from(users).where(eq(users.email, initialAdminUser.email));
    if (!existingAdmin || existingAdmin.length === 0) {
      await db.insert?.(users).values(initialAdminUser);
    }

    // Seed segments
    for (const seg of initialSegments) {
      const existing = await db.select?.().from(segments).where(eq(segments.code, seg.code));
      if (!existing || existing.length === 0) {
        await db.insert?.(segments).values(seg);
      }
    }

    // Seed admission segments
    for (const adm of initialAdmissionSegments) {
      const existing = await db.select?.().from(admissionSegments).where(eq(admissionSegments.code, adm.code));
      if (!existing || existing.length === 0) {
        await db.insert?.(admissionSegments).values(adm);
      }
    }

    // Seed boards
    for (const board of initialBoards) {
      const existing = await db.select?.().from(boards).where(eq(boards.code, board.code));
      if (!existing || existing.length === 0) {
        await db.insert?.(boards).values(board);
      }
    }

    // Seed subjects
    for (const subject of initialSubjects) {
      const existing = await db.select?.().from(subjects).where(eq(subjects.code, subject.code));
      if (!existing || existing.length === 0) {
        await db.insert?.(subjects).values(subject);
      }
    }

    console.log('Database seed completed successfully.');
    return { success: true };
  } catch (error) {
    console.error('Database seed failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
