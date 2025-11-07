import { Injectable } from "@nestjs/common";
import { CategoryService } from './category.service';
import * as fs from "fs";
import { diskStorage } from "multer";
import * as path from 'path';


@Injectable()
export class CategoryFileService {
  constructor(private readonly categoryService: CategoryService) {}

  async handleCategoryFile(categoryId: number, file: Express.Multer.File) {
    console.log('Received file:', file);
    if (!file) {
      return null;
    }

    try {
      const categoryDir = path.join('uploads', 'categories', String(categoryId));
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }

      const ext = path.extname(file.originalname);
      const finalFileName = `CategoryImage${Date.now()}${ext}`;
      const finalPath = path.join(categoryDir, finalFileName);

      await fs.promises.rename(file.path, finalPath);

      const imagePath = finalPath.replace(/\\/g, '/');

      const category = await this.categoryService.updateCategory(categoryId, { category_image: imagePath });

      return {
        path: imagePath,
        fileName: finalFileName,
        category
      };

    } catch (error) {
      throw new Error(`Failed to handle category file: `);
    }
  }
  async removeCategoryFile(categoryId: number) {
    const category = await this.categoryService.findOne(categoryId);
    if (category.category_image && fs.existsSync(category.category_image)) {
      await fs.promises.unlink(category.category_image);
    }
    return this.categoryService.updateCategory(categoryId, { category_image: '' });
  }
}
