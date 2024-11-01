import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MealsService } from './meals.service'
import { MealsController } from './meals.controller'
import { Meal } from './entities/meal.entity'
import { MealIngredient } from './entities/meal-ingredient.entity'
import { ResponseService } from '../shared/response-format/response.service'
import { Unit } from './entities/units.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Meal, MealIngredient, Unit])],
  controllers: [MealsController],
  providers: [MealsService, ResponseService],
  exports: [MealsService],
})
export class MealsModule {}
