import { LocalStorageProvider } from '@/lib/storage/local-provider';
import { CloudinaryStorageProvider } from '@/lib/storage/cloudinary-provider';

export interface UploadResult {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface StorageProvider {
  uploadFile(fileBuffer: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  deleteFile(url: string): Promise<boolean>;
}

export class DataUrlStorageProvider implements StorageProvider {
  async uploadFile(fileBuffer: Buffer, filename: string, mimeType: string): Promise<UploadResult> {
    const base64 = fileBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;
    return {
      url: dataUrl,
      filename,
      mimeType,
      size: fileBuffer.length,
    };
  }

  async deleteFile(_url: string): Promise<boolean> {
    return true;
  }
}

export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || 'local';

  if (provider === 'cloudinary') {
    const cloudinaryProvider = new CloudinaryStorageProvider();
    if (cloudinaryProvider.isConfigured()) {
      return cloudinaryProvider as StorageProvider;
    } else {
      console.warn('STORAGE_PROVIDER is set to cloudinary, but credentials are not set. Falling back to DataUrlStorageProvider.');
      return new DataUrlStorageProvider();
    }
  }

  if (provider === 'local') {
    try {
      return new LocalStorageProvider() as unknown as StorageProvider;
    } catch {
      return new DataUrlStorageProvider();
    }
  }

  return new DataUrlStorageProvider();
}

