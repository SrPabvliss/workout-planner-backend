import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoutineExercisesController } from './controllers/routine-exercises.controller'
import { RoutineMealsController } from './controllers/routine-meals.controller'
import { RoutineExercisesService } from './services/routine-exercises.service'
import { RoutineMealsService } from './services/routine-meals.service'
import { ResponseService } from 'src/shared/response-format/response.service'
import { UsersModule } from 'src/users/users.module'
import { StudentsModule } from 'src/students/students.module'
import { ExercisesModule } from 'src/exercises/exercises.module'
import { MealsModule } from 'src/meals/meals.module'
import { Routine } from './entities/routine.entity'
import { RoutineDay } from './entities/routine-day.entity'
import { RoutineMeal } from './entities/routine-meal.entity'
import { PresetsModule } from 'src/presets/presets.module'
import { RoutineExercise } from './entities/routine-excercise.entity'
import { Exercise } from 'src/exercises/entities/exercise.entity'
import { Meal } from 'src/meals/entities/meal.entity'
import { Trainer } from 'src/trainers/entities/trainer.entity'
import { TrainersModule } from 'src/trainers/trainers.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Routine,
      RoutineDay,
      RoutineExercise,
      RoutineMeal,
      Exercise,
      Meal,
      Trainer,
    ]),
    UsersModule,
    StudentsModule,
    TrainersModule,
    PresetsModule,
    ExercisesModule,
    MealsModule,
  ],
  controllers: [RoutineExercisesController, RoutineMealsController],
  providers: [RoutineExercisesService, RoutineMealsService, ResponseService],
  exports: [RoutineExercisesService, RoutineMealsService, TypeOrmModule],
})
export class RoutinesModule {}
