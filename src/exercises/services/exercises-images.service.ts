import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ResponseService } from 'src/shared/response-format/response.service'
import { CreateExerciseImageDto } from '../dto/create-exercise-image.dto'
import EXERCISE_MESSAGES from '../messages/exercise-messages'
import { ExerciseImage } from '../entities/exercises-images.entity'
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service'

@Injectable()
export class ExerciseImagesService {
  private readonly logger = new Logger(ExerciseImagesService.name)

  constructor(
    @InjectRepository(ExerciseImage)
    private readonly exerciseImageRepository: Repository<ExerciseImage>,
    private readonly responseService: ResponseService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createMany(images: CreateExerciseImageDto[], exerciseId: number) {
    try {
      if (images.some((img) => img.is_main)) {
        await this.exerciseImageRepository.update(
          { exercise: { id: exerciseId }, is_main: true },
          { is_main: false },
        )
      }

      const uploadedImages = []

      for (const image of images) {
        const cloudinaryResponse = await this.cloudinaryService.uploadFile(
          image.file,
        )

        if (!cloudinaryResponse) {
          return this.responseService.error(
            EXERCISE_MESSAGES.IMAGES_CREATE_ERROR,
          )
        }

        if (!cloudinaryResponse.success) {
          this.logger.error(
            `Error uploading image to Cloudinary: ${cloudinaryResponse.message}`,
          )
          continue
        }

        const exerciseImage = this.exerciseImageRepository.create({
          url: cloudinaryResponse.data.secure_url,
          public_id: cloudinaryResponse.data.public_id,
          is_main: image.is_main,
          exercise: { id: exerciseId },
        })

        const savedImage =
          await this.exerciseImageRepository.save(exerciseImage)
        uploadedImages.push(savedImage)
      }

      if (uploadedImages.length === 0) {
        return this.responseService.error(EXERCISE_MESSAGES.IMAGES_CREATE_ERROR)
      }

      return this.responseService.success(
        uploadedImages,
        EXERCISE_MESSAGES.IMAGES_CREATED,
      )
    } catch (error) {
      this.logger.error('Error creating exercise images:', error)
      return this.responseService.error(EXERCISE_MESSAGES.IMAGES_CREATE_ERROR)
    }
  }

  async removeImage(imageId: number, exerciseId: number) {
    try {
      const image = await this.exerciseImageRepository.findOne({
        where: { id: imageId, exercise: { id: exerciseId } },
      })

      if (!image) {
        return this.responseService.error(EXERCISE_MESSAGES.IMAGE_NOT_FOUND)
      }

      const deleteResponse = await this.cloudinaryService.deleteFile(
        image.public_id,
      )

      if (!deleteResponse)
        return this.responseService.error(EXERCISE_MESSAGES.IMAGE_DELETE_ERROR)

      if (!deleteResponse.success) {
        this.logger.error(
          `Error deleting image from Cloudinary: ${deleteResponse.message}`,
        )
        return this.responseService.error(EXERCISE_MESSAGES.IMAGE_DELETE_ERROR)
      }

      await this.exerciseImageRepository.delete({
        id: imageId,
        exercise: { id: exerciseId },
      })

      return this.responseService.success(true, EXERCISE_MESSAGES.IMAGE_DELETED)
    } catch (error) {
      this.logger.error('Error deleting exercise image:', error)
      return this.responseService.error(EXERCISE_MESSAGES.IMAGE_DELETE_ERROR)
    }
  }

  async setMainImage(imageId: number, exerciseId: number) {
    try {
      const image = await this.exerciseImageRepository.findOne({
        where: { id: imageId, exercise: { id: exerciseId } },
      })

      if (!image) {
        return this.responseService.error(EXERCISE_MESSAGES.IMAGE_NOT_FOUND)
      }

      await this.exerciseImageRepository.update(
        { exercise: { id: exerciseId }, is_main: true },
        { is_main: false },
      )

      await this.exerciseImageRepository.update(
        { id: imageId },
        { is_main: true },
      )

      return this.responseService.success(
        true,
        EXERCISE_MESSAGES.MAIN_IMAGE_UPDATED,
      )
    } catch (error) {
      this.logger.error('Error setting main image:', error)
      return this.responseService.error(
        EXERCISE_MESSAGES.MAIN_IMAGE_UPDATE_ERROR,
      )
    }
  }
}
