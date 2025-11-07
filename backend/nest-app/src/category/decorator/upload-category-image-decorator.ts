import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';

export function uploadCategoryImage(fieldName: string) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const dir = path.join('uploads', 'categories', 'temp');
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
          },
          filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const filename = `Category_${Date.now()}${ext}`;
            cb(null, filename);
          },
        }),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (req, file, cb) => {
          if (['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error('Invalid file type — only PNG/JPEG allowed'), false);
          }
        },
      }),
    ),
  );
}

