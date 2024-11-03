import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ResponseService } from 'src/shared/response-format/response.service'
import { Preset } from '../entities/preset.entity'
import { PresetDay } from '../entities/preset-day.entity'
import { Exercise } from '../../exercises/entities/exercise.entity'
import { PRESET_EXERCISE_MESSAGES } from '../messages/preset-exercise-messages'
import { UsersService } from 'src/users/users.service'
import { PresetExercise } from '../entities/preset-excercise.entity'
import { CreatePresetExerciseDto } from '../dto/exercises/create-preset-exercise.dto'
import { UpdatePresetExerciseDto } from '../dto/exercises/update-preset-exercise.dto'

@Injectable()
export class PresetExercisesService {
  constructor(
    @InjectRepository(Preset)
    private readonly presetRepository: Repository<Preset>,
    @InjectRepository(PresetDay)
    private readonly presetDayRepository: Repository<PresetDay>,
    @InjectRepository(PresetExercise)
    private readonly presetExerciseRepository: Repository<PresetExercise>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    private readonly usersService: UsersService,
    private readonly responseService: ResponseService,
  ) {}

  async create(
    createPresetExerciseDto: CreatePresetExerciseDto,
    userId: number,
  ) {
    try {
      // 1. Obtener usuario
      const userResponse = await this.usersService.findOne(userId)
      if (!userResponse || !userResponse.data) {
        return this.responseService.error(
          PRESET_EXERCISE_MESSAGES.USER_NOT_FOUND,
        )
      }

      // 2. Crear el preset
      const preset = this.presetRepository.create({
        name: createPresetExerciseDto.name,
        description: createPresetExerciseDto.description,
        created_by: userResponse.data,
      })

      const savedPreset = await this.presetRepository.save(preset)

      // 3. Procesar cada día
      for (const dayDto of createPresetExerciseDto.days) {
        // Verificar que todos los ejercicios existan antes de crear el día
        const exercises = await Promise.all(
          dayDto.exercises.map((exerciseDto) =>
            this.exerciseRepository.findOneBy({ id: exerciseDto.exercise_id }),
          ),
        )

        if (exercises.some((exercise) => !exercise)) {
          await this.presetRepository.delete(savedPreset.id)
          return this.responseService.error(
            PRESET_EXERCISE_MESSAGES.EXERCISE_NOT_FOUND,
          )
        }

        // Crear el día
        const presetDay = this.presetDayRepository.create({
          day_of_week: dayDto.day_of_week,
          preset: savedPreset,
        })
        const savedDay = await this.presetDayRepository.save(presetDay)

        // Crear los ejercicios del día
        await Promise.all(
          dayDto.exercises.map(async (exerciseDto, index) => {
            const presetExercise = this.presetExerciseRepository.create({
              day: savedDay,
              exercise: exercises[index],
              sets: exerciseDto.sets,
              reps: exerciseDto.reps,
            })
            return this.presetExerciseRepository.save(presetExercise)
          }),
        )
      }

      const createdPresetResponse = await this.findOne(savedPreset.id)
      if (!createdPresetResponse || !createdPresetResponse.data) {
        return this.responseService.error(PRESET_EXERCISE_MESSAGES.CREATE_ERROR)
      }

      return this.responseService.success(
        createdPresetResponse.data,
        PRESET_EXERCISE_MESSAGES.CREATED,
      )
    } catch (error) {
      return this.responseService.error(PRESET_EXERCISE_MESSAGES.CREATE_ERROR)
    }
  }

  async findAll() {
    try {
      const presets = await this.presetRepository
        .createQueryBuilder('preset')
        .leftJoinAndSelect('preset.created_by', 'user')
        .leftJoinAndSelect('preset.days', 'days')
        .leftJoinAndSelect('days.exercises', 'exercises')
        .leftJoinAndSelect('exercises.exercise', 'exercise')
        .orderBy('preset.created_at', 'DESC')
        .addOrderBy('days.day_of_week', 'ASC')
        .getMany()

      if (!presets.length) {
        return this.responseService.error(
          PRESET_EXERCISE_MESSAGES.MANY_NOT_FOUND,
        )
      }

      return this.responseService.success(
        presets,
        PRESET_EXERCISE_MESSAGES.FOUND_MANY,
      )
    } catch (error) {
      return this.responseService.error(PRESET_EXERCISE_MESSAGES.FIND_ERROR)
    }
  }

  async findOne(id: number) {
    try {
      const preset = await this.presetRepository
        .createQueryBuilder('preset')
        .leftJoinAndSelect('preset.created_by', 'user')
        .leftJoinAndSelect('preset.days', 'days')
        .leftJoinAndSelect('days.exercises', 'exercises')
        .leftJoinAndSelect('exercises.exercise', 'exercise')
        .where('preset.id = :id', { id })
        .orderBy('days.day_of_week', 'ASC')
        .getOne()

      if (!preset) {
        return this.responseService.error(PRESET_EXERCISE_MESSAGES.NOT_FOUND)
      }

      return this.responseService.success(
        preset,
        PRESET_EXERCISE_MESSAGES.FOUND,
      )
    } catch (error) {
      return this.responseService.error(PRESET_EXERCISE_MESSAGES.FIND_ERROR)
    }
  }

  async update(id: number, updatePresetExerciseDto: UpdatePresetExerciseDto) {
    try {
      const presetResponse = await this.findOne(id)
      if (!presetResponse || !presetResponse.data) return

      // 1. Actualizar datos básicos del preset
      if (updatePresetExerciseDto.name || updatePresetExerciseDto.description) {
        await this.presetRepository.update(id, {
          name: updatePresetExerciseDto.name,
          description: updatePresetExerciseDto.description,
        })
      }

      // 2. Si hay días para actualizar
      if (updatePresetExerciseDto.days) {
        // Verificar ejercicios nuevos
        for (const dayDto of updatePresetExerciseDto.days) {
          if (dayDto.exercises) {
            const exercises = await Promise.all(
              dayDto.exercises.map((exerciseDto) =>
                this.exerciseRepository.findOneBy({
                  id: exerciseDto.exercise_id,
                }),
              ),
            )

            if (exercises.some((exercise) => !exercise)) {
              return this.responseService.error(
                PRESET_EXERCISE_MESSAGES.EXERCISE_NOT_FOUND,
              )
            }
          }
        }

        // Eliminar ejercicios y días actuales
        await this.presetExerciseRepository
          .createQueryBuilder()
          .delete()
          .from(PresetExercise)
          .where(
            'day_id IN (SELECT id FROM preset_day WHERE preset_id = :id)',
            {
              id,
            },
          )
          .execute()

        await this.presetDayRepository
          .createQueryBuilder()
          .delete()
          .from(PresetDay)
          .where('preset_id = :id', { id })
          .execute()

        // Crear nuevos días y ejercicios
        for (const dayDto of updatePresetExerciseDto.days) {
          const presetDay = this.presetDayRepository.create({
            day_of_week: dayDto.day_of_week,
            preset: presetResponse.data,
          })
          const savedDay = await this.presetDayRepository.save(presetDay)

          if (dayDto.exercises) {
            const exercises = await Promise.all(
              dayDto.exercises.map((exerciseDto) =>
                this.exerciseRepository.findOneBy({
                  id: exerciseDto.exercise_id,
                }),
              ),
            )

            await Promise.all(
              dayDto.exercises.map(async (exerciseDto, index) => {
                const presetExercise = this.presetExerciseRepository.create({
                  day: savedDay,
                  exercise: exercises[index],
                  sets: exerciseDto.sets,
                  reps: exerciseDto.reps,
                })
                return this.presetExerciseRepository.save(presetExercise)
              }),
            )
          }
        }
      }

      const updatedPresetResponse = await this.findOne(id)
      if (!updatedPresetResponse || !updatedPresetResponse.data) {
        return this.responseService.error(PRESET_EXERCISE_MESSAGES.UPDATE_ERROR)
      }

      return this.responseService.success(
        updatedPresetResponse.data,
        PRESET_EXERCISE_MESSAGES.UPDATED,
      )
    } catch (error) {
      return this.responseService.error(PRESET_EXERCISE_MESSAGES.UPDATE_ERROR)
    }
  }

  async remove(id: number) {
    try {
      const presetResponse = await this.findOne(id)
      if (!presetResponse || !presetResponse.data) return

      // Usar query builder para eliminar en cascada
      await this.presetExerciseRepository
        .createQueryBuilder()
        .delete()
        .from(PresetExercise)
        .where('day_id IN (SELECT id FROM preset_day WHERE preset_id = :id)', {
          id,
        })
        .execute()

      await this.presetDayRepository
        .createQueryBuilder()
        .delete()
        .from(PresetDay)
        .where('preset_id = :id', { id })
        .execute()

      await this.presetRepository.delete(id)

      return this.responseService.success(
        presetResponse.data,
        PRESET_EXERCISE_MESSAGES.DELETED,
      )
    } catch (error) {
      return this.responseService.error(PRESET_EXERCISE_MESSAGES.DELETE_ERROR)
    }
  }
}
