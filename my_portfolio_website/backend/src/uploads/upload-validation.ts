import { BadRequestException } from '@nestjs/common';

export function validatedResourceType(
  file: Express.Multer.File,
  imageLimit: number,
  videoLimit: number,
): 'image' | 'video' | 'raw' {
  if (!file?.buffer?.length) throw new BadRequestException('No file provided');
  const video = file.mimetype.startsWith('video/');
  if (
    file.size !== file.buffer.length ||
    file.size > (video ? videoLimit : imageLimit)
  ) {
    throw new BadRequestException(
      `File exceeds the ${Math.round((video ? videoLimit : imageLimit) / 1024 / 1024)} MB upload limit`,
    );
  }
  const bytes = file.buffer;
  const matches = {
    'image/jpeg': bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
    'image/png': bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    'image/gif': /^GIF8[79]a$/.test(bytes.subarray(0, 6).toString('ascii')),
    'image/webp':
      bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
      bytes.subarray(8, 12).toString('ascii') === 'WEBP',
    'application/pdf': bytes.subarray(0, 5).toString('ascii') === '%PDF-',
    'video/mp4':
      bytes.subarray(4, 8).toString('ascii') === 'ftyp' &&
      /^(isom|iso[2-9]|mp4[12]|avc1|M4V |MSNV|dash)$/.test(
        bytes.subarray(8, 12).toString('ascii'),
      ),
    'video/webm':
      bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3])) &&
      bytes.subarray(0, 4096).includes(Buffer.from('webm')),
  };
  if (!matches[file.mimetype as keyof typeof matches])
    throw new BadRequestException(
      'Unsupported type or file content does not match its MIME type',
    );
  return video
    ? 'video'
    : file.mimetype === 'application/pdf'
      ? 'raw'
      : 'image';
}
