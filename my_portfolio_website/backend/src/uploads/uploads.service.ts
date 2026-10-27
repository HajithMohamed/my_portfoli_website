import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'node:stream';
import { validatedResourceType } from './upload-validation';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async upload(file: Express.Multer.File, folder = 'hz-labs') {
    const resourceType = validatedResourceType(
      file,
      10 * 1024 * 1024,
      this.videoLimit(),
    );
    if (!/^hz-labs(?:\/[a-zA-Z0-9_-]+)*$/.test(folder))
      throw new BadRequestException('Invalid upload folder');
    if (
      [
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET',
      ].some((key) => !this.configService.get<string>(key)?.trim())
    ) {
      throw new ServiceUnavailableException(
        'Cloudinary uploads are not configured. Add the cloud name, API key and API secret to the backend configuration.',
      );
    }

    let response: UploadApiResponse;
    try {
      response = await this.streamUpload(file.buffer, folder, resourceType);
    } catch {
      throw new ServiceUnavailableException(
        'Media upload failed. Please try again.',
      );
    }
    return {
      url: response.secure_url,
      publicId: response.public_id,
      resourceType,
      bytes: response.bytes,
      format: response.format,
      mimeType: file.mimetype,
      provider: 'cloudinary',
      posterUrl:
        resourceType === 'video'
          ? cloudinary.url(response.public_id, {
              resource_type: 'video',
              format: 'jpg',
              secure: true,
              transformation: [
                { start_offset: '0', width: 1280, crop: 'limit' },
              ],
            })
          : undefined,
    };
  }

  private streamUpload(
    buffer: Buffer,
    folder: string,
    resourceType: 'image' | 'raw' | 'video',
  ) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          overwrite: false,
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

      stream.on('error', reject);
      Readable.from(buffer).on('error', reject).pipe(stream);
    });
  }

  private videoLimit() {
    const configured = Number(
      this.configService.get<string>('VIDEO_UPLOAD_MAX_MB') ?? 60,
    );
    return (
      Math.min(
        120,
        Math.max(1, Number.isFinite(configured) ? configured : 60),
      ) *
      1024 *
      1024
    );
  }
}
