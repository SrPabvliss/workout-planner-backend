import { Module } from '@nestjs/common'
import { ExercisesController } from './controllers/exercises.controller'
import { ExercisesService } from './services/exercises.service'
import { ResponseService } from 'src/shared/response-format/response.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Exercise } from './entities/exercise.entity'
import { ExerciseImage } from './entities/exercises-images.entity'
import { CategoryModule } from 'src/category/category.module'
import { ExerciseImagesController } from './controllers/exercises-images.controller'
import { ExerciseImagesService } from './services/exercises-images.service'
import { ExerciseCategory } from 'src/category/entities/exercise-category.entity'
import { Category } from 'src/category/entities/category.entity'
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exercise,
      ExerciseImage,
      ExerciseCategory,
      Category,
    ]),
    CategoryModule,
    CloudinaryModule,
  ],
  controllers: [ExercisesController, ExerciseImagesController],
  providers: [ExercisesService, ExerciseImagesService, ResponseService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
