import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Preset } from './entities/preset.entity'
import { PresetDay } from './entities/preset-day.entity'
import { PresetMeal } from './entities/preset-meal.entity'
import { Exercise } from '../exercises/entities/exercise.entity'
import { Meal } from '../meals/entities/meal.entity'
import { UsersModule } from 'src/users/users.module'
import { ResponseService } from 'src/shared/response-format/response.service'
import { PresetExercise } from './entities/preset-excercise.entity'
import { PresetExercisesController } from './controllers/preset-exercise.controller'
import { PresetMealsController } from './controllers/preset-meal.controller'
import { PresetMealsService } from './services/preset-meal.service'
import { PresetExercisesService } from './services/presets-exercise.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Preset,
      PresetDay,
      PresetExercise,
      PresetMeal,
      Exercise,
      Meal,
    ]),
    UsersModule,
  ],
  controllers: [PresetExercisesController, PresetMealsController],
  providers: [PresetExercisesService, PresetMealsService, ResponseService],
  exports: [PresetExercisesService, PresetMealsService],
})
export class PresetsModule {}
