import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryService } from './category.service'
import { ResponseService } from 'src/shared/response-format/response.service'
import { Category } from './entities/category.entity'
import { ExerciseCategory } from './entities/exercise-category.entity'
import { CategoryController } from './category.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([Category, ExerciseCategory])],
  controllers: [CategoryController],
  providers: [CategoryService, ResponseService],
  exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule {}
