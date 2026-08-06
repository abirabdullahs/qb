import { v2 as cloudinary } from 'cloudinary';

export interface UploadResult {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

export class CloudinaryStorageProvider {
  private configured = false;

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    if (cloudinaryUrl || (cloudName && apiKey && apiSecret)) {
      if (!cloudinaryUrl && cloudName && apiKey && apiSecret) {
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
          secure: true,
        });
      }
      this.configured = true;
    }
  }

  isConfigured(): boolean {
    return this.configured;
  }

  async uploadFile(fileBuffer: Buffer, filename: string, mimeType: string): Promise<UploadResult> {
    if (!this.configured) {
      throw new Error(
        'Cloudinary environment variables missing. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (or CLOUDINARY_URL).'
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'question_bank_uploads',
          resource_type: 'auto',
          filename_override: filename,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload failed'));
          }
          resolve({
            url: result.secure_url,
            filename: result.public_id,
            mimeType: mimeType,
            size: result.bytes || fileBuffer.length,
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  async deleteFile(url: string): Promise<boolean> {
    if (!this.configured) return false;
    try {
      const parts = url.split('/');
      const filenameWithExt = parts[parts.length - 1];
      const publicId = filenameWithExt.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`question_bank_uploads/${publicId}`);
      }
      return true;
    } catch (err) {
      console.error('Failed to delete from Cloudinary:', err);
      return false;
    }
  }
}
