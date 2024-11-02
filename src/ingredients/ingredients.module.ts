import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { IngredientsService } from './ingredients.service'
import { IngredientsController } from './ingredients.controller'
import { Ingredient } from './entities/ingredient.entity'
import { NutritionalInfo } from './entities/nutritional-info.entity'
import { ResponseService } from '../shared/response-format/response.service'

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, NutritionalInfo])],
  controllers: [IngredientsController],
  providers: [IngredientsService, ResponseService],
  exports: [IngredientsService, TypeOrmModule],
})
export class IngredientsModule {}
