import { db } from '@/lib/db/client';
import { attachments } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

export interface AttachmentRecord {
  id: number;
  attachableType: string;
  attachableId: number;
  imageUrl: string;
  altText?: string | null;
  orderNo?: number | null;
  createdAt?: Date | string;
}

let mockAttachmentsStore: AttachmentRecord[] = [];

export async function createAttachmentRecord(data: Omit<AttachmentRecord, 'id' | 'createdAt'>): Promise<AttachmentRecord> {
  try {
    if (process.env.DATABASE_URL) {
      const [inserted] = await db
        .insert(attachments)
        .values({
          attachableType: data.attachableType,
          attachableId: data.attachableId,
          imageUrl: data.imageUrl,
          altText: data.altText || null,
          orderNo: data.orderNo || 0,
        })
        .returning();
      return inserted;
    }
  } catch (err) {
    console.warn('DB createAttachment failed, falling back to mock store:', err);
  }

  const mockItem: AttachmentRecord = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    attachableType: data.attachableType,
    attachableId: data.attachableId,
    imageUrl: data.imageUrl,
    altText: data.altText || null,
    orderNo: data.orderNo || 0,
    createdAt: new Date().toISOString(),
  };
  mockAttachmentsStore.push(mockItem);
  return mockItem;
}

export async function getAttachmentsForEntity(attachableType: string, attachableId: number): Promise<AttachmentRecord[]> {
  try {
    if (process.env.DATABASE_URL) {
      const records = await db
        .select()
        .from(attachments)
        .where(
          and(
            eq(attachments.attachableType, attachableType),
            eq(attachments.attachableId, attachableId)
          )
        );
      return records;
    }
  } catch (err) {
    console.warn('DB getAttachmentsForEntity failed, falling back to mock store:', err);
  }

  return mockAttachmentsStore.filter(
    (a) => a.attachableType === attachableType && a.attachableId === attachableId
  );
}

export async function deleteAttachmentRecord(id: number): Promise<boolean> {
  try {
    if (process.env.DATABASE_URL) {
      await db.delete(attachments).where(eq(attachments.id, id));
      return true;
    }
  } catch (err) {
    console.warn('DB deleteAttachmentRecord failed:', err);
  }

  mockAttachmentsStore = mockAttachmentsStore.filter((a) => a.id !== id);
  return true;
}

export async function deleteAttachmentsForEntity(attachableType: string, attachableId: number): Promise<boolean> {
  try {
    if (process.env.DATABASE_URL) {
      await db
        .delete(attachments)
        .where(
          and(
            eq(attachments.attachableType, attachableType),
            eq(attachments.attachableId, attachableId)
          )
        );
      return true;
    }
  } catch (err) {
    console.warn('DB deleteAttachmentsForEntity failed:', err);
  }

  mockAttachmentsStore = mockAttachmentsStore.filter(
    (a) => !(a.attachableType === attachableType && a.attachableId === attachableId)
  );
  return true;
}
