import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';
import { File } from 'fastify-multer/lib/interfaces';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  async uploadFile(
    file: File,
    folder: string = 'code-ride/chat',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            this.logger.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result!);
        },
      );

      const readableStream = new Readable();
      readableStream._read = () => {};
      readableStream.push(file.buffer as Buffer);
      readableStream.push(null);
      readableStream.pipe(upload);
    });
  }

  async uploadImage(file: File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return this.uploadFile(file, 'code-ride/images');
  }

  async uploadVoiceNote(file: File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return this.uploadFile(file, 'code-ride/voice-notes');
  }

  async uploadRawFile(file: File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return this.uploadFile(file, 'code-ride/documents');
  }
}
