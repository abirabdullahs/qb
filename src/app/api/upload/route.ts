import { NextRequest, NextResponse } from 'next/server';
import { getStorageProvider } from '@/domains/attachment/storage.provider';
import { createAttachmentRecord } from '@/domains/attachment/attachment.repository';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Please sign in to upload attachments' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const attachableType = (formData.get('attachableType') as string) || 'general';
    const attachableIdStr = formData.get('attachableId') as string;
    const attachableId = attachableIdStr ? parseInt(attachableIdStr, 10) : 0;
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Validate mime type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, GIF, WebP, and SVG are supported.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const storage = getStorageProvider();
    const uploaded = await storage.uploadFile(buffer, file.name, file.type);

    let attachmentRecord = null;
    if (attachableId > 0) {
      attachmentRecord = await createAttachmentRecord({
        attachableType,
        attachableId,
        imageUrl: uploaded.url,
        altText,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        url: uploaded.url,
        filename: uploaded.filename,
        mimeType: uploaded.mimeType,
        size: uploaded.size,
        attachmentId: attachmentRecord ? attachmentRecord.id : null,
      },
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'File upload failed' }, { status: 500 });
  }
}
