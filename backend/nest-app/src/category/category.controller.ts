

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { CategoryFileService } from './category-file-service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { uploadCategoryImage } from './decorator/upload-category-image-decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoriesService: CategoryService,
    private readonly categoryFileService: CategoryFileService,
  ) { }

  @Post()
  @uploadCategoryImage('category_image')
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const category = await this.categoriesService.create(createCategoryDto);
    if (!file) {
      console.log('⚠️ No file received');
    } else {
      console.log('3️⃣ File received:', file.originalname);
    }

    const categoryDetail = await this.categoryFileService.handleCategoryFile(
      category.id,
      file!,
    );
    return {
      status: true,
      message: 'Data added successfully',
      categoryDetail: categoryDetail?.category
    };
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }



  @Patch('change-status')
  async changeStatus(@Body() body: { id: number; status: number }) {
    const { id, status } = body;
    return this.categoriesService.changeStatus(id, status);
  }

  @Patch('remove-image')
  async removeImage(@Body() body: { id: number }) {
    const { id } = body;
    const category = await this.categoriesService.findOne(+id);
    if(category.category_image){
      await this.categoryFileService.removeCategoryFile(category.id);
    }
    return {
      status: true,
      message: 'Category image removed successfully',
      category: category,
    };
  }

  @Patch(':id')
  @uploadCategoryImage('category_image')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updatedCategory = await this.categoriesService.update(+id, updateCategoryDto);

    if (file) {
      console.log('🖼️ Updating category image:', file.originalname);
      await this.categoryFileService.handleCategoryFile(updatedCategory.id, file);
    } else {
      console.log('⚠️ No new image provided');
    }

    return {
      status: true,
      message: 'Category updated successfully',
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}