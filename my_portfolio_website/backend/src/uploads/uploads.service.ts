import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'node:stream';
import { validatedResourceType } from './upload-validation';

/**
 * Turns a Cloudinary failure into an actionable, secret-free message. The SDK
 * rejects with a plain `{ message, http_code }` object rather than an Error.
 */
export function describeCloudinaryError(error: unknown): string {
  const message =
    (typeof error === 'object' && error !== null && 'message' in error
      ? String(error.message)
      : String(error)) || 'Unknown error';
  const httpCode =
    typeof error === 'object' && error !== null && 'http_code' in error
      ? Number(error.http_code)
      : undefined;

  if (/cloud_name/i.test(message)) {
    return `Media upload failed: ${message}. Check CLOUDINARY_CLOUD_NAME in the backend environment variables and redeploy.`;
  }
  if (
    httpCode === 401 ||
    /invalid signature|api_key|api key|api_secret/i.test(message)
  ) {
    return `Media upload failed: ${message}. Cloudinary rejected the credentials — check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (no extra spaces, not swapped) and redeploy.`;
  }
  return `Media upload failed: ${message}`;
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor(private readonly configService: ConfigService) {
    // Trim so a value pasted with a trailing space/newline doesn't silently
    // break Cloudinary's request signature.
    cloudinary.config({
      cloud_name: this.setting('CLOUDINARY_CLOUD_NAME'),
      api_key: this.setting('CLOUDINARY_API_KEY'),
      api_secret: this.setting('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  private setting(key: string): string | undefined {
    return this.configService.get<string>(key)?.trim() || undefined;
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
      ].some((key) => !this.setting(key))
    ) {
      throw new ServiceUnavailableException(
        'Cloudinary uploads are not configured. Add the cloud name, API key and API secret to the backend configuration.',
      );
    }

    let response: UploadApiResponse;
    try {
      response = await this.streamUpload(file.buffer, folder, resourceType);
    } catch (error) {
      const message = describeCloudinaryError(error);
      this.logger.error(message);
      throw new ServiceUnavailableException(message);
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
            // Keep http_code on the Error so the failure can be diagnosed.
            reject(
              Object.assign(
                new Error(error?.message ?? 'Cloudinary upload failed'),
                { http_code: error?.http_code },
              ),
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
