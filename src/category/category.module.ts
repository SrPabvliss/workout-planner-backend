import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { ResponseService } from 'src/shared/response-format/response.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, ResponseService],
  exports: [CategoryService],
})
export class CategoryModule {}
