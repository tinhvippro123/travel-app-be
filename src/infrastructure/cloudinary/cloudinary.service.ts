import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

/**
 * Service wrapper cho Cloudinary upload.
 * Các module khác inject CloudinaryService để upload file.
 */
@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  /**
   * Upload file buffer lên Cloudinary.
   * @param file - Express.Multer.File
   * @param folder - Folder trên Cloudinary (vd: 'tours', 'avatars')
   */
  async uploadFile(
    file: Express.Multer.File,
    folder = 'travel-app',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            this.logger.error(`Upload failed: ${error.message}`);
            reject(new Error(error.message));
          } else {
            resolve(result!);
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(upload);
    });
  }

  /**
   * Xóa file trên Cloudinary theo public_id.
   */
  async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
