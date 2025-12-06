import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import path from "path";
import * as fs from 'fs';
export function uploadCustomerImage(fieldName: string) {

    return applyDecorators(
        UseInterceptors(
            FileInterceptor(fieldName, {
                storage: diskStorage({
                    destination: (req, file, cb) => {
                        const dir = path.join('uploads', 'customers', 'temp');
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir, { recursive: true });
                        }
                        cb(null, dir);
                    },
                    filename: (req, file, cb) => {
                        const ext = path.extname(file.originalname);
                        const filename = `customerImage${Date.now()}${ext}`;
                        cb(null, filename);
                    }

                }),
                limits: {
                    fileSize: 5 * 5 * 1024
                },
                fileFilter: (req, file, cb) => {
                    if (['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(file.mimetype)) {
                        cb(null, true);
                    } else {
                        cb(new Error('Invalid file type selected'), false);
                    }
                }
            }

            )
        )
    )
}