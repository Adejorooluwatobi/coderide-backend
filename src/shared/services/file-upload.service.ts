import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises';
import { File } from 'fastify-multer/lib/interfaces';
 
@Injectable()
export class FileUploadService {
  constructor(private configService: ConfigService) {}

  async uploadAudioFile(file: File): Promise<string> {
    this.validateAudioFile(file);
    
    const uploadDir = this.configService.get('UPLOAD_DIR', './uploads/audio');
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadDir, fileName);
    
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer as Buffer);
    
    return `/uploads/audio/${fileName}`;
  }

  async uploadImageFile(file: File): Promise<string> {
    this.validateImageFile(file);
    
    const uploadDir = this.configService.get('UPLOAD_DIR', './uploads/images');
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadDir, fileName);
    
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer as Buffer);
    
    return `/uploads/images/${fileName}`;
  }

  private validateAudioFile(file: File): void {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid audio file type');
    }
    
    if (file.size && file.size > maxSize) {
      throw new BadRequestException('Audio file too large (max 50MB)');
    }
  }
 
  private validateImageFile(file: File): void {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image file type');
    }
    
    if (file.size && file.size > maxSize) {
      throw new BadRequestException('Image file too large (max 5MB)');
    }
  }
}