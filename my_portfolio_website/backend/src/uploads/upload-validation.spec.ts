import { BadRequestException } from '@nestjs/common';
import { validatedResourceType } from './upload-validation';

const file = (mimetype: string, bytes: number[]) =>
  ({
    mimetype,
    buffer: Buffer.from(bytes),
    size: bytes.length,
  }) as Express.Multer.File;
describe('Project media validation', () => {
  it('accepts matching PNG and MP4 signatures', () => {
    expect(
      validatedResourceType(
        file('image/png', [137, 80, 78, 71, 13, 10, 26, 10]),
        100,
        100,
      ),
    ).toBe('image');
    expect(
      validatedResourceType(
        file('video/mp4', [0, 0, 0, 20, ...Buffer.from('ftypisom')]),
        100,
        100,
      ),
    ).toBe('video');
  });
  it('rejects spoofed image/video MIME types, unsupported formats and oversized files', () => {
    expect(() =>
      validatedResourceType(
        file('image/png', [...Buffer.from('<script>')]),
        100,
        100,
      ),
    ).toThrow(BadRequestException);
    expect(() =>
      validatedResourceType(file('video/mp4', [0, 1, 2]), 100, 100),
    ).toThrow(BadRequestException);
    expect(() =>
      validatedResourceType(file('image/svg+xml', [1, 2]), 100, 100),
    ).toThrow(BadRequestException);
    expect(() =>
      validatedResourceType(
        file('video/webm', [0x1a, 0x45, 0xdf, 0xa3, ...Buffer.from('webm')]),
        100,
        4,
      ),
    ).toThrow(BadRequestException);
  });
});
