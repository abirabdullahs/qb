export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface StorageProvider {
  uploadFile(file: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  deleteFile(filename: string): Promise<boolean>;
}

import { LocalStorageProvider } from './local-provider';

export function getStorageProvider(): StorageProvider {
  const providerType = process.env.STORAGE_PROVIDER || 'local';
  if (providerType === 'local') {
    return new LocalStorageProvider();
  }
  // Default fallback
  return new LocalStorageProvider();
}
