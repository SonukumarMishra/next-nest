import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryFileService } from './category-file-service';

@Module({
  imports:[TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService,CategoryFileService],
  exports:[CategoryService,CategoryFileService]
})
export class CategoryModule {}
