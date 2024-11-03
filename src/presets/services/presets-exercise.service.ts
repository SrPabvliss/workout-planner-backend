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
import { PresetType } from '../enums/preset-type.enum'

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
    const userResponse = await this.usersService.findOne(userId)
    if (!userResponse || !userResponse.data) {
      return this.responseService.error(PRESET_EXERCISE_MESSAGES.USER_NOT_FOUND)
    }

    const exerciseIds = new Set(
      createPresetExerciseDto.days.flatMap((day) =>
        day.exercises.map((exercise) => exercise.exercise_id),
      ),
    )

    const exercisesPromises = Array.from(exerciseIds).map((id) =>
      this.exerciseRepository.findOneBy({ id }),
    )

    const exercises = await Promise.all(exercisesPromises)
    const foundExercises = exercises.filter(
      (exercise): exercise is Exercise => exercise !== null,
    )

    if (foundExercises.length !== exerciseIds.size) {
      const foundIds = new Set(foundExercises.map((exercise) => exercise.id))
      const missingIds = Array.from(exerciseIds).filter(
        (id) => !foundIds.has(id),
      )

      console.error('Missing exercise IDs:', missingIds)
      return this.responseService.error(
        `${PRESET_EXERCISE_MESSAGES.EXERCISE_NOT_FOUND}: ${missingIds.join(', ')}`,
      )
    }

    const preset = this.presetRepository.create({
      name: createPresetExerciseDto.name,
      description: createPresetExerciseDto.description,
      created_by: userResponse.data,
      type: PresetType.EXERCISE,
    })

    const savedPreset = await this.presetRepository.save(preset)

    for (const dayDto of createPresetExerciseDto.days) {
      const presetDay = this.presetDayRepository.create({
        day_of_week: dayDto.day_of_week,
        preset: savedPreset,
      })
      const savedDay = await this.presetDayRepository.save(presetDay)

      const presetExercises = dayDto.exercises.map((exerciseDto) => {
        const exercise = foundExercises.find(
          (e) => e.id === exerciseDto.exercise_id,
        )
        return this.presetExerciseRepository.create({
          day: savedDay,
          exercise: exercise!,
          sets: exerciseDto.sets,
          reps: exerciseDto.reps,
        })
      })

      await this.presetExerciseRepository.save(presetExercises)
    }

    const result = await this.findOne(savedPreset.id)
    if (!result || !result.data) {
      await this.presetRepository.delete(savedPreset.id)
      return this.responseService.error(PRESET_EXERCISE_MESSAGES.CREATE_ERROR)
    }

    return this.responseService.success(
      result.data,
      PRESET_EXERCISE_MESSAGES.CREATED,
    )
  }

  async findAll() {
    const presets = await this.presetRepository.find({
      relations: {
        created_by: true,
        days: {
          exercises: {
            exercise: true,
          },
        },
      },
      order: {
        created_at: 'DESC',
        days: {
          day_of_week: 'ASC',
          exercises: {
            id: 'ASC',
          },
        },
      },
      where: {
        type: PresetType.EXERCISE,
      },
    })

    if (!presets.length) {
      return this.responseService.error(PRESET_EXERCISE_MESSAGES.MANY_NOT_FOUND)
    }

    return this.responseService.success(
      presets,
      PRESET_EXERCISE_MESSAGES.FOUND_MANY,
    )
  }

  async findOne(id: number) {
    const preset = await this.presetRepository
      .createQueryBuilder('preset')
      .leftJoinAndSelect('preset.created_by', 'created_by')
      .leftJoinAndSelect('preset.days', 'days')
      .leftJoinAndSelect('days.exercises', 'preset_exercises')
      .leftJoinAndSelect('preset_exercises.exercise', 'exercise')
      .where('preset.id = :id', { id })
      .orderBy({
        'days.day_of_week': 'ASC',
        'preset_exercises.id': 'ASC',
      })
      .getOne()

    if (!preset) {
      return this.responseService.error(PRESET_EXERCISE_MESSAGES.NOT_FOUND)
    }

    return this.responseService.success(preset, PRESET_EXERCISE_MESSAGES.FOUND)
  }

  async update(id: number, updatePresetExerciseDto: UpdatePresetExerciseDto) {
    try {
      const presetResponse = await this.findOne(id)
      if (!presetResponse || !presetResponse.data) return

      if (updatePresetExerciseDto.name || updatePresetExerciseDto.description) {
        await this.presetRepository.update(id, {
          name: updatePresetExerciseDto.name,
          description: updatePresetExerciseDto.description,
        })
      }

      if (updatePresetExerciseDto.days) {
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
    const presetResponse = await this.findOne(id)
    if (!presetResponse || !presetResponse.data) return

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
  }
}
