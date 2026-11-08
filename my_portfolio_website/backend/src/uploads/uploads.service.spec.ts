import { ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadResponseCallback,
} from 'cloudinary';
import { PassThrough } from 'node:stream';
import { describeCloudinaryError, UploadsService } from './uploads.service';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    url: jest.fn(() => 'https://res.cloudinary.com/test/video/upload/demo.jpg'),
    uploader: { upload_stream: jest.fn() },
  },
}));

const configuration: Record<string, string> = {
  CLOUDINARY_CLOUD_NAME: 'test',
  CLOUDINARY_API_KEY: 'test-key',
  CLOUDINARY_API_SECRET: 'test-secret',
};
const response = {
  secure_url: 'https://res.cloudinary.com/test/image/upload/photo.png',
  public_id: 'hz-labs/projects/photo',
  bytes: 8,
  format: 'png',
} as UploadApiResponse;
const file = (mimetype: string, buffer: Buffer) =>
  ({ mimetype, buffer, size: buffer.length }) as Express.Multer.File;

describe('UploadsService', () => {
  let service: UploadsService;
  const uploadStream = jest.mocked(cloudinary.uploader.upload_stream);

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UploadsService(new ConfigService({ ...configuration }));
    uploadStream.mockImplementation((...args: unknown[]) => {
      const callback = args[1] as UploadResponseCallback;
      const stream = new PassThrough();
      stream.on('finish', () => callback(undefined, response));
      return stream;
    });
  });

  it('uploads images to Cloudinary and returns metadata for the project gallery', async () => {
    const result = await service.upload(
      file('image/png', Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      'hz-labs/projects',
    );

    expect(uploadStream).toHaveBeenCalledWith(
      {
        folder: 'hz-labs/projects',
        resource_type: 'image',
        overwrite: false,
      },
      expect.any(Function),
    );
    expect(result).toMatchObject({
      url: response.secure_url,
      publicId: response.public_id,
      resourceType: 'image',
      provider: 'cloudinary',
      mimeType: 'image/png',
      bytes: 8,
    });
    expect(result.posterUrl).toBeUndefined();
  });

  it('uploads videos using the video resource type and generates a poster', async () => {
    const result = await service.upload(
      file('video/mp4', Buffer.from([0, 0, 0, 20, ...Buffer.from('ftypisom')])),
      'hz-labs/projects',
    );

    expect(uploadStream).toHaveBeenCalledWith(
      expect.objectContaining({ resource_type: 'video' }),
      expect.any(Function),
    );
    expect(result).toMatchObject({
      resourceType: 'video',
      mimeType: 'video/mp4',
      posterUrl: 'https://res.cloudinary.com/test/video/upload/demo.jpg',
    });
    expect(cloudinary.url).toHaveBeenCalledWith(
      response.public_id,
      expect.objectContaining({ resource_type: 'video', format: 'jpg' }),
    );
  });

  it.each(Object.keys(configuration))(
    'reports a missing %s before contacting Cloudinary',
    async (key) => {
      service = new UploadsService(
        new ConfigService({ ...configuration, [key]: ' ' }),
      );

      await expect(
        service.upload(
          file('image/png', Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
        ),
      ).rejects.toThrow('Cloudinary uploads are not configured');
      expect(uploadStream).not.toHaveBeenCalled();
    },
  );

  it('returns a retryable error when the Cloudinary stream fails', async () => {
    uploadStream.mockImplementation(() => {
      const stream = new PassThrough();
      process.nextTick(() =>
        stream.destroy(new Error('Connection interrupted')),
      );
      return stream;
    });

    await expect(
      service.upload(
        file('image/png', Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      ),
    ).rejects.toThrow(ServiceUnavailableException);
  });

  it('surfaces a credential hint when Cloudinary rejects the signature', async () => {
    uploadStream.mockImplementation((...args: unknown[]) => {
      const callback = args[1] as UploadResponseCallback;
      const stream = new PassThrough();
      stream.on('finish', () =>
        callback(
          { message: 'Invalid Signature abc123', http_code: 401 } as never,
          undefined,
        ),
      );
      return stream;
    });

    await expect(
      service.upload(
        file('image/png', Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      ),
    ).rejects.toThrow(
      /Invalid Signature.*CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET/,
    );
  });

  it('trims credentials before configuring Cloudinary', () => {
    new UploadsService(
      new ConfigService({
        CLOUDINARY_CLOUD_NAME: ' test \n',
        CLOUDINARY_API_KEY: 'test-key ',
        CLOUDINARY_API_SECRET: '\ttest-secret\n',
      }),
    );

    expect(cloudinary.config).toHaveBeenLastCalledWith(
      expect.objectContaining({
        cloud_name: 'test',
        api_key: 'test-key',
        api_secret: 'test-secret',
      }),
    );
  });
});

describe('describeCloudinaryError', () => {
  it('points to the cloud name for an invalid cloud_name', () => {
    expect(
      describeCloudinaryError({
        message: 'Invalid cloud_name foo',
        http_code: 401,
      }),
    ).toContain('CLOUDINARY_CLOUD_NAME');
  });

  it('keeps the original message for other failures', () => {
    expect(describeCloudinaryError(new Error('socket hang up'))).toBe(
      'Media upload failed: socket hang up',
    );
  });
});
