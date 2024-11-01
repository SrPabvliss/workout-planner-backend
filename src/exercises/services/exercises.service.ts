import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Exercise } from '../entities/exercise.entity'
import { ExerciseCategory } from '../../category/entities/exercise-category.entity'
import { CreateExerciseDto } from '../dto/create-exercise.dto'
import { UpdateExerciseDto } from '../dto/update-exercise.dto'
import { ResponseService } from 'src/shared/response-format/response.service'
import { normalizeString } from 'src/shared/utils/string-utils'
import { ExerciseImagesService } from './exercises-images.service'
import EXERCISE_MESSAGES from '../messages/exercise-messages'
import { Category } from 'src/category/entities/category.entity'
import { CreateExerciseImageDto } from '../dto/create-exercise-image.dto'

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(ExerciseCategory)
    private readonly exerciseCategoryRepository: Repository<ExerciseCategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly exerciseImagesService: ExerciseImagesService,
    private readonly responseService: ResponseService,
  ) {}

  private async getExerciseWithRelations(id: number) {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: {
        images: true,
        exerciseCategories: {
          category: true,
        },
        created_by: true,
      },
      order: {
        images: {
          is_main: 'DESC',
        },
        exerciseCategories: {
          category: {
            name: 'ASC',
          },
        },
      },
    })

    if (exercise) {
      const categories = exercise.exerciseCategories.map((ec) => ec.category)
      const exerciseResponse = {
        ...exercise,
        categories: categories,
        exerciseCategories: undefined,
      }

      return exerciseResponse
    }

    return exercise
  }

  private async checkExerciseExists(name: string, excludeId?: number) {
    const normalizedName = normalizeString(name)

    const query = this.exerciseRepository
      .createQueryBuilder('exercise')
      .where('exercise.normalized_name = :normalizedName', { normalizedName })

    if (excludeId) {
      query.andWhere('exercise.id != :id', { id: excludeId })
    }

    return await query.getOne()
  }
  private async validateCategories(categoryIds: number[]) {
    const categories = await this.categoryRepository.findByIds(categoryIds)
    const foundIds = categories.map((cat) => cat.id)
    const missingIds = categoryIds.filter((id) => !foundIds.includes(id))

    if (missingIds.length > 0) {
      return {
        valid: false,
        message: `Las siguientes categorías no existen: ${missingIds.join(', ')}`,
      }
    }

    return { valid: true }
  }

  async create(createExerciseDto: CreateExerciseDto, userId: number = 1) {
    const {
      images,
      categories,
    mainImageIndexes = [],
      ...exerciseData
    } = createExerciseDto

    const existingExercise = await this.checkExerciseExists(exerciseData.name)
    if (existingExercise) {
      return this.responseService.error(EXERCISE_MESSAGES.ALREADY_EXISTS)
    }

    if (categories && categories.length > 0) {
      const categoryValidation = await this.validateCategories(categories)
      if (!categoryValidation.valid) {
        return this.responseService.error(categoryValidation.message)
      }
    }

    try {
      const exercise = this.exerciseRepository.create({
        ...exerciseData,
        normalized_name: normalizeString(exerciseData.name),
        created_by: { id: userId },
      })

      const savedExercise = await this.exerciseRepository.save(exercise)

      if (categories && categories.length > 0) {
        const exerciseCategories = categories.map((categoryId) =>
          this.exerciseCategoryRepository.create({
            exercise_id: savedExercise.id,
            category_id: categoryId,
          }),
        )
        await this.exerciseCategoryRepository.save(exerciseCategories)
      }

      if (images && images.length > 0) {
        const imageData = images.map((file, index) => ({
          file,
          is_main: mainImageIndexes.includes(index),
        }))

        await this.exerciseImagesService.createMany(imageData, savedExercise.id)
      }

      const completeExercise = await this.getExerciseWithRelations(
        savedExercise.id,
      )

      return this.responseService.success(
        completeExercise,
        EXERCISE_MESSAGES.CREATED,
      )
    } catch (error) {
      console.error('Error creating exercise:', error)
      return this.responseService.error(EXERCISE_MESSAGES.CREATE_ERROR)
    }
  }

  async update(id: number, updateExerciseDto: UpdateExerciseDto) {
    const exercise = await this.findOne(id)
    if (!exercise) {
      return this.responseService.error(EXERCISE_MESSAGES.NOT_FOUND)
    }

    const {
      images,
      categories,
      mainImageIndexes = [],
      ...exerciseData
    } = updateExerciseDto

    const updatedFields: Partial<Exercise> = { ...exerciseData }

    if (exerciseData.name) {
      const existingExercise = await this.checkExerciseExists(
        exerciseData.name,
        id,
      )
      if (existingExercise) {
        return this.responseService.error(EXERCISE_MESSAGES.ALREADY_EXISTS)
      }
      updatedFields.normalized_name = normalizeString(exerciseData.name)
    }

    try {
      const updatedExercise = await this.exerciseRepository.save({
        ...exercise.data,
        ...updatedFields,
      })

      if (categories) {
        await this.exerciseCategoryRepository.delete({ exercise_id: id })
        const newCategories = categories.map((categoryId) =>
          this.exerciseCategoryRepository.create({
            exercise_id: id,
            category_id: categoryId,
          }),
        )
        await this.exerciseCategoryRepository.save(newCategories)
      }

      if (images && images.length > 0) {
        const imageData = images.map((file, index) => ({
          file,
          is_main: mainImageIndexes.includes(index),
        }))

        await this.exerciseImagesService.createMany(imageData, id)
      }

      const completeExercise = await this.getExerciseWithRelations(id)

      return this.responseService.success(
        completeExercise,
        EXERCISE_MESSAGES.UPDATED,
      )
    } catch (error) {
      console.error('Error updating exercise:', error)
      return this.responseService.error(EXERCISE_MESSAGES.UPDATE_ERROR)
    }
  }

  async findAll() {
    try {
      const exercises = await this.exerciseRepository.find({
        relations: {
          images: true,
          exerciseCategories: {
            category: true,
          },
          created_by: true,
        },
        order: {
          name: 'ASC',
          images: {
            is_main: 'DESC',
          },
          exerciseCategories: {
            category: {
              name: 'ASC',
            },
          },
        },
      })

      const formattedExercises = exercises.map((exercise) => ({
        ...exercise,
        categories: exercise.exerciseCategories.map((ec) => ec.category),
        exerciseCategories: undefined,
      }))

      return this.responseService.success(
        formattedExercises,
        EXERCISE_MESSAGES.FOUND_MANY,
      )
    } catch (error) {
      console.error('Error finding exercises:', error)
      return this.responseService.error(EXERCISE_MESSAGES.FIND_ERROR)
    }
  }
  async findOne(id: number) {
    try {
      const exercise = await this.getExerciseWithRelations(id)

      if (!exercise) {
        return this.responseService.error(EXERCISE_MESSAGES.NOT_FOUND)
      }

      return this.responseService.success(exercise, EXERCISE_MESSAGES.FOUND)
    } catch (error) {
      console.error('Error finding exercise:', error)
      return this.responseService.error(EXERCISE_MESSAGES.FIND_ERROR)
    }
  }

  async remove(id: number) {
    const exercise = await this.getExerciseWithRelations(id)
    if (!exercise) return

    try {
      await this.exerciseRepository.delete(id)
      return this.responseService.success(exercise, EXERCISE_MESSAGES.DELETED)
    } catch (error) {
      console.error('Error deleting exercise:', error)
      return this.responseService.error(EXERCISE_MESSAGES.DELETE_ERROR)
    }
  }
}
