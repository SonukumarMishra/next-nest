import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException("Category Not Available");
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(id,updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.categoryRepository.delete(id);
  }

  async updateCategory(id: number, updateData: Partial<Category>) {
    await this.categoryRepository.update(id, updateData);
    return this.findOne(id);
  }
  async changeStatus(id: number, status: number) {
    const category = await this.findOne(id);
    category.status = status;
    return this.categoryRepository.save(category);
  }
}
