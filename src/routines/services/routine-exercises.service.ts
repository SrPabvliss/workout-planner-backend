import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'
import { ResponseService } from 'src/shared/response-format/response.service'
import { UsersService } from 'src/users/users.service'
import { StudentsService } from 'src/students/students.service'
import { PresetExercisesService } from 'src/presets/services/presets-exercise.service'
import { Routine } from '../entities/routine.entity'
import { RoutineDay } from '../entities/routine-day.entity'
import { Exercise } from 'src/exercises/entities/exercise.entity'
import { CreateRoutineExerciseDto } from '../dto/exercises/create-routine-exercise.dto'
import { UpdateRoutineExerciseDto } from '../dto/exercises/update-routine-exercise.dto'
import { RoutineStatus, RoutineTypes } from '../enums/routine.enum'
import { RoutineExercise } from '../entities/routine-excercise.entity'
import { ROUTINE_EXERCISE_MESSAGES } from '../messages/routine-exercise.messages'
import { TrainersService } from 'src/trainers/trainers.service'

@Injectable()
export class RoutineExercisesService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
    @InjectRepository(RoutineDay)
    private readonly routineDayRepository: Repository<RoutineDay>,
    @InjectRepository(RoutineExercise)
    private readonly routineExerciseRepository: Repository<RoutineExercise>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    private readonly trainersService: TrainersService,
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService,
    private readonly presetExercisesService: PresetExercisesService,
    private readonly responseService: ResponseService,
  ) {}

  async create(createRoutineExerciseDto: CreateRoutineExerciseDto) {
    if (
      new Date(createRoutineExerciseDto.start_date) >
      new Date(createRoutineExerciseDto.end_date)
    ) {
      return this.responseService.error(ROUTINE_EXERCISE_MESSAGES.INVALID_DATES)
    }

    const student = await this.studentsService.findOne(
      createRoutineExerciseDto.student_id,
    )
    if (!student || !student?.data) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.STUDENT_NOT_FOUND,
      )
    }

    const trainer = await this.trainersService.findOne(
      createRoutineExerciseDto.trainer_id,
    )
    if (!trainer || !trainer?.data) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.TRAINER_NOT_FOUND,
      )
    }

    const exerciseIds = new Set(
      createRoutineExerciseDto.days.flatMap((day) =>
        day.exercises.map((exercise) => exercise.exercise_id),
      ),
    )

    const exercises = await Promise.all(
      Array.from(exerciseIds).map((id) =>
        this.exerciseRepository.findOneBy({ id }),
      ),
    )

    if (exercises.some((exercise) => !exercise)) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.EXERCISE_NOT_FOUND,
      )
    }

    const routine = this.routineRepository.create({
      ...createRoutineExerciseDto,
      type: RoutineTypes.EXERCISE,
      student: student.data,
      trainer: trainer.data,
      created_by: trainer.data,
    })

    const savedRoutine = await this.routineRepository.save(routine)
    for (const dayDto of createRoutineExerciseDto.days) {
      const routineDay = this.routineDayRepository.create({
        day_of_week: dayDto.day_of_week,
        date: dayDto.date,
        routine: savedRoutine,
      })

      const savedDay = await this.routineDayRepository.save(routineDay)

      const routineExercises = dayDto.exercises.map((exerciseDto) => {
        const exercise = exercises.find((e) => e.id === exerciseDto.exercise_id)
        return this.routineExerciseRepository.create({
          ...exerciseDto,
          day: savedDay,
          exercise: exercise,
        })
      })

      await this.routineExerciseRepository.save(routineExercises)
    }

    return this.responseService.success(
      await this.findOne(savedRoutine.id),
      ROUTINE_EXERCISE_MESSAGES.CREATED,
    )
  }

  async createFromPreset(presetId: number, startDate: Date, studentId: number) {
    const presetResponse = await this.presetExercisesService.findOne(presetId)
    if (!presetResponse || !presetResponse?.data) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.PRESET_NOT_FOUND,
      )
    }

    const studentResponse = await this.studentsService.findOne(studentId)
    if (!studentResponse || !studentResponse?.data) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.STUDENT_NOT_FOUND,
      )
    }

    const preset = presetResponse.data
    const student = studentResponse.data

    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + preset.days.length)

    const routine = this.routineRepository.create({
      name: `${preset.name} - ${student.user.first_name}`,
      description: preset.description,
      type: RoutineTypes.EXERCISE,
      status: RoutineStatus.ACTIVE,
      start_date: start,
      end_date: end,
      student: student,
      trainer: student.trainer,
      created_by: student.trainer,
    })

    const savedRoutine = await this.routineRepository.save(routine)

    for (const presetDay of preset.days) {
      const date = new Date(start)
      date.setDate(date.getDate() + (presetDay.day_of_week - 1))

      const routineDay = this.routineDayRepository.create({
        day_of_week: presetDay.day_of_week,
        date: date,
        routine: savedRoutine,
      })

      const savedDay = await this.routineDayRepository.save(routineDay)

      const routineExercises = presetDay.exercises.map((presetExercise) =>
        this.routineExerciseRepository.create({
          exercise: presetExercise.exercise,
          sets: presetExercise.sets,
          reps: presetExercise.reps,
          order: presetExercise.order,
          day: savedDay,
          completed: false,
        }),
      )

      await this.routineExerciseRepository.save(routineExercises)
    }

    return this.responseService.success(
      await this.findOne(savedRoutine.id),
      ROUTINE_EXERCISE_MESSAGES.CREATED_FROM_PRESET,
    )
  }

  async findAll() {
    const routines = await this.routineRepository.find({
      where: { type: RoutineTypes.EXERCISE },
      relations: {
        student: {
          user: true,
        },
        trainer: {
          user: true,
        },
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
            order: 'ASC',
          },
        },
      },
    })

    if (!routines.length) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.MANY_NOT_FOUND,
      )
    }

    return this.responseService.success(
      routines,
      ROUTINE_EXERCISE_MESSAGES.FOUND_MANY,
    )
  }

  async findAllByStudent(studentId: number) {
    const routines = await this.routineRepository.find({
      where: {
        type: RoutineTypes.EXERCISE,
        student: { id: studentId },
      },
      relations: {
        student: {
          user: true,
        },
        trainer: {
          user: true,
        },
        days: {
          exercises: {
            exercise: true,
          },
        },
      },
      order: {
        created_at: 'DESC',
      },
    })

    if (!routines.length) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.MANY_NOT_FOUND,
      )
    }

    return this.responseService.success(
      routines,
      ROUTINE_EXERCISE_MESSAGES.FOUND_MANY,
    )
  }

  async findActiveByStudent(studentId: number) {
    const routines = await this.routineRepository.find({
      where: {
        type: RoutineTypes.EXERCISE,
        student: { id: studentId },
        status: RoutineStatus.ACTIVE,
      },
      relations: {
        student: {
          user: true,
        },
        trainer: {
          user: true,
        },
        days: {
          exercises: {
            exercise: true,
          },
        },
      },
      order: {
        start_date: 'DESC',
      },
    })

    if (!routines.length) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.NO_ACTIVE_ROUTINES,
      )
    }

    return this.responseService.success(
      routines,
      ROUTINE_EXERCISE_MESSAGES.FOUND_ACTIVE,
    )
  }

  async findOne(id: number) {
    const routine = await this.routineRepository.findOne({
      where: {
        id,
        type: RoutineTypes.EXERCISE,
      },
      relations: {
        student: {
          user: true,
        },
        trainer: {
          user: true,
        },
        days: {
          exercises: {
            exercise: true,
          },
        },
      },
      order: {
        days: {
          day_of_week: 'ASC',
          exercises: {
            order: 'ASC',
          },
        },
      },
    })

    if (!routine) {
      return this.responseService.error(ROUTINE_EXERCISE_MESSAGES.NOT_FOUND)
    }

    return this.responseService.success(
      routine,
      ROUTINE_EXERCISE_MESSAGES.FOUND,
    )
  }

  async update(id: number, updateRoutineExerciseDto: UpdateRoutineExerciseDto) {
    const routineResponse = await this.findOne(id)
    if (!routineResponse || !routineResponse?.data) return

    const routine = routineResponse.data

    if (
      routine.status === RoutineStatus.COMPLETED ||
      routine.status === RoutineStatus.CANCELLED
    ) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.CANNOT_UPDATE_FINISHED,
      )
    }

    if (updateRoutineExerciseDto.name || updateRoutineExerciseDto.description) {
      await this.routineRepository.update(id, {
        name: updateRoutineExerciseDto.name,
        description: updateRoutineExerciseDto.description,
      })
    }

    if (updateRoutineExerciseDto.days) {
      const exerciseIds = new Set(
        updateRoutineExerciseDto.days.flatMap((day) =>
          day.exercises.map((exercise) => exercise.exercise_id),
        ),
      )

      const exercises = await Promise.all(
        Array.from(exerciseIds).map((id) =>
          this.exerciseRepository.findOneBy({ id }),
        ),
      )

      if (exercises.some((exercise) => !exercise)) {
        return this.responseService.error(
          ROUTINE_EXERCISE_MESSAGES.EXERCISE_NOT_FOUND,
        )
      }

      await this.routineExerciseRepository
        .createQueryBuilder()
        .delete()
        .from(RoutineExercise)
        .where(
          'day_id IN (SELECT id FROM routine_day WHERE routine_id = :id)',
          { id },
        )
        .execute()

      await this.routineDayRepository
        .createQueryBuilder()
        .delete()
        .from(RoutineDay)
        .where('routine_id = :id', { id })
        .execute()

      for (const dayDto of updateRoutineExerciseDto.days) {
        const routineDay = this.routineDayRepository.create({
          ...dayDto,
          routine: routine,
        })

        const savedDay = await this.routineDayRepository.save(routineDay)

        const routineExercises = dayDto.exercises.map((exerciseDto) => {
          const exercise = exercises.find(
            (e) => e.id === exerciseDto.exercise_id,
          )
          return this.routineExerciseRepository.create({
            ...exerciseDto,
            day: savedDay,
            exercise: exercise,
          })
        })

        await this.routineExerciseRepository.save(routineExercises)
      }
    }

    return this.responseService.success(
      await this.findOne(id),
      ROUTINE_EXERCISE_MESSAGES.UPDATED,
    )
  }

  async markExerciseCompleted(routineId: number, exerciseId: number) {
    const routineResponse = await this.findOne(routineId)
    if (!routineResponse || !routineResponse?.data) return

    const routine = routineResponse.data

    if (routine.status !== RoutineStatus.ACTIVE) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.ROUTINE_NOT_ACTIVE,
      )
    }

    const exercise = await this.routineExerciseRepository.findOne({
      where: {
        id: exerciseId,
        day: {
          routine: { id: routineId },
        },
      },
    })

    if (!exercise) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.EXERCISE_NOT_FOUND,
      )
    }

    exercise.completed = true
    await this.routineExerciseRepository.save(exercise)

    return this.responseService.success(
      exercise,
      ROUTINE_EXERCISE_MESSAGES.EXERCISE_COMPLETED,
    )
  }

  async markExerciseUncompleted(routineId: number, exerciseId: number) {
    const routineResponse = await this.findOne(routineId)
    if (!routineResponse || !routineResponse?.data) return

    const routine = routineResponse.data

    if (routine.status !== RoutineStatus.ACTIVE) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.ROUTINE_NOT_ACTIVE,
      )
    }

    const exercise = await this.routineExerciseRepository.findOne({
      where: {
        id: exerciseId,
        day: {
          routine: { id: routineId },
        },
      },
    })

    if (!exercise) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.EXERCISE_NOT_FOUND,
      )
    }

    exercise.completed = false
    await this.routineExerciseRepository.save(exercise)

    return this.responseService.success(
      exercise,
      ROUTINE_EXERCISE_MESSAGES.EXERCISE_UNCOMPLETED,
    )
  }

  async changeStatus(id: number, status: RoutineStatus) {
    const routineResponse = await this.findOne(id)
    if (!routineResponse || !routineResponse?.data) return

    const routine = routineResponse.data

    if (
      routine.status === RoutineStatus.COMPLETED ||
      routine.status === RoutineStatus.CANCELLED
    ) {
      return this.responseService.error(
        ROUTINE_EXERCISE_MESSAGES.CANNOT_CHANGE_STATUS,
      )
    }

    if (status === RoutineStatus.COMPLETED) {
      const hasUncompletedExercises = routine.days.some((day) =>
        day.exercises.some((exercise) => !exercise.completed),
      )

      if (hasUncompletedExercises) {
        return this.responseService.error(
          ROUTINE_EXERCISE_MESSAGES.UNCOMPLETED_EXERCISES,
        )
      }
    }

    routine.status = status
    await this.routineRepository.save(routine)

    const updated = await this.findOne(id)

    if (!updated || !updated?.data) return

    return this.responseService.success(
      updated.data,
      ROUTINE_EXERCISE_MESSAGES.STATUS_UPDATED,
    )
  }

  async remove(id: number) {
    const routineResponse = await this.findOne(id)
    if (!routineResponse || !routineResponse?.data) return

    const routine = routineResponse.data

    await this.routineExerciseRepository
      .createQueryBuilder()
      .delete()
      .from(RoutineExercise)
      .where('day_id IN (SELECT id FROM routine_day WHERE routine_id = :id)', {
        id,
      })
      .execute()

    await this.routineDayRepository
      .createQueryBuilder()
      .delete()
      .from(RoutineDay)
      .where('routine_id = :id', { id })
      .execute()

    await this.routineRepository.delete(id)

    return this.responseService.success(
      routine,
      ROUTINE_EXERCISE_MESSAGES.DELETED,
    )
  }
}
