import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'node:stream';

@Injectable()
export class UploadsService {
  private readonly maxBytes = 10 * 1024 * 1024;
  private readonly allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
  ]);

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async upload(file: Express.Multer.File, folder = 'hz-labs') {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (file.size > this.maxBytes) {
      throw new BadRequestException('File exceeds 10 MB upload limit');
    }
    if (!this.allowedMimeTypes.has(file.mimetype)) {
      throw new BadRequestException('Unsupported file type');
    }
    if (!this.configService.get<string>('CLOUDINARY_CLOUD_NAME')) {
      throw new ServiceUnavailableException('Cloudinary is not configured');
    }

    const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
    const response = await this.streamUpload(file.buffer, folder, resourceType);
    return {
      url: response.secure_url,
      publicId: response.public_id,
      resourceType,
      bytes: response.bytes,
      format: response.format,
    };
  }

  private streamUpload(
    buffer: Buffer,
    folder: string,
    resourceType: 'image' | 'raw',
  ) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(
              error instanceof Error
                ? error
                : new Error(error?.message ?? 'Cloudinary upload failed'),
            );
            return;
          }
          resolve(result);
        },
      );

      Readable.from(buffer).pipe(stream);
    });
  }
}
