import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Meal } from './entities/meal.entity'
import { MealIngredient } from './entities/meal-ingredient.entity'
import { ResponseService } from '../shared/response-format/response.service'
import { IngredientsModule } from '../ingredients/ingredients.module'
import { MealsController } from './controllers/meals.controller'
import { UnitsController } from './controllers/units.controller'
import { UnitsService } from './services/units.service'
import { MealsService } from './services/meals.service'
import { Unit } from './entities/units.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Meal, MealIngredient, Unit]),
    IngredientsModule,
  ],
  controllers: [MealsController, UnitsController],
  providers: [MealsService, UnitsService, ResponseService],
  exports: [MealsService, UnitsService],
})
export class MealsModule {}
