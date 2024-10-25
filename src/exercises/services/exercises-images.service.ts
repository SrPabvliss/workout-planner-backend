import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ResponseService } from 'src/shared/response-format/response.service'
import { CreateExerciseImageDto } from '../dto/create-exercise-image.dto'
import EXERCISE_MESSAGES from '../messages/exercise-messages'
import { ExerciseImage } from '../entities/exercises-images.entity'

@Injectable()
export class ExerciseImagesService {
  constructor(
    @InjectRepository(ExerciseImage)
    private readonly exerciseImageRepository: Repository<ExerciseImage>,
    private readonly responseService: ResponseService,
  ) {}

  async createMany(images: CreateExerciseImageDto[], exerciseId: number) {
    try {
      if (images.some((img) => img.is_main)) {
        await this.exerciseImageRepository.update(
          { exercise: { id: exerciseId }, is_main: true },
          { is_main: false },
        )
      }

      const exerciseImages = images.map((image) =>
        this.exerciseImageRepository.create({
          ...image,
          exercise: { id: exerciseId },
        }),
      )

      const savedImages =
        await this.exerciseImageRepository.save(exerciseImages)
      return this.responseService.success(
        savedImages,
        EXERCISE_MESSAGES.IMAGES_CREATED,
      )
    } catch (error) {
      console.error('Error creating exercise images:', error)
      return this.responseService.error(EXERCISE_MESSAGES.IMAGES_CREATE_ERROR)
    }
  }

  async setMainImage(imageId: number, exerciseId: number) {
    try {
      await this.exerciseImageRepository.update(
        { exercise: { id: exerciseId }, is_main: true },
        { is_main: false },
      )

      await this.exerciseImageRepository.update(
        { id: imageId, exercise: { id: exerciseId } },
        { is_main: true },
      )

      return this.responseService.success(
        null,
        EXERCISE_MESSAGES.MAIN_IMAGE_UPDATED,
      )
    } catch (error) {
      console.error('Error setting main image:', error)
      return this.responseService.error(
        EXERCISE_MESSAGES.MAIN_IMAGE_UPDATE_ERROR,
      )
    }
  }

  async removeImage(imageId: number, exerciseId: number) {
    try {
      const deleteResult = await this.exerciseImageRepository.delete({
        id: imageId,
        exercise: { id: exerciseId },
      })

      if (!deleteResult.affected) {
        return this.responseService.error(EXERCISE_MESSAGES.IMAGE_NOT_FOUND)
      }

      return this.responseService.success(null, EXERCISE_MESSAGES.IMAGE_DELETED)
    } catch (error) {
      console.error('Error deleting exercise image:', error)
      return this.responseService.error(EXERCISE_MESSAGES.IMAGE_DELETE_ERROR)
    }
  }
}
