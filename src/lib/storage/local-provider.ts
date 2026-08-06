import fs from 'fs';
import path from 'path';
import { StorageProvider, UploadResult } from './index';

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.STORAGE_LOCAL_DIR || path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Buffer, originalFilename: string, mimeType: string): Promise<UploadResult> {
    const ext = path.extname(originalFilename) || '.bin';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(this.uploadDir, uniqueName);

    await fs.promises.writeFile(filePath, file);

    const publicUrl = `/uploads/${uniqueName}`;

    return {
      url: publicUrl,
      filename: uniqueName,
      size: file.length,
      mimeType,
    };
  }

  async deleteFile(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting file:', err);
      return false;
    }
  }
}
