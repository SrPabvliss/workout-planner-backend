import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { ResponseService } from 'src/shared/response-format/response.service'
import { UsersService } from 'src/users/users.service'
import { StudentsService } from 'src/students/students.service'
import { PresetMealsService } from 'src/presets/services/preset-meal.service'
import { Routine } from '../entities/routine.entity'
import { RoutineDay } from '../entities/routine-day.entity'
import { RoutineMeal } from '../entities/routine-meal.entity'
import { Meal } from 'src/meals/entities/meal.entity'
import { CreateRoutineMealDto } from '../dto/meals/create-routine-meal.dto'
import { UpdateRoutineMealDto } from '../dto/meals/update-routine-meal.dto'
import { RoutineStatus, RoutineTypes } from '../enums/routine.enum'
import { ROUTINE_MEAL_MESSAGES } from '../messages/routine-meal.messages'

@Injectable()
export class RoutineMealsService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
    @InjectRepository(RoutineDay)
    private readonly routineDayRepository: Repository<RoutineDay>,
    @InjectRepository(RoutineMeal)
    private readonly routineMealRepository: Repository<RoutineMeal>,
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService,
    private readonly presetMealsService: PresetMealsService,
    private readonly responseService: ResponseService,
  ) {}

  async create(createRoutineMealDto: CreateRoutineMealDto) {
    try {
      // Validar fechas
      if (
        new Date(createRoutineMealDto.start_date) >
        new Date(createRoutineMealDto.end_date)
      ) {
        return this.responseService.error(ROUTINE_MEAL_MESSAGES.INVALID_DATES)
      }

      // Validar estudiante

      const studentResponse = await this.studentsService.findOne(
        createRoutineMealDto.student_id,
      )
      if (!studentResponse || !studentResponse?.data) {
        return this.responseService.error(
          ROUTINE_MEAL_MESSAGES.STUDENT_NOT_FOUND,
        )
      }

      // Validar entrenador
      const trainerResponse = await this.usersService.findOne(
        createRoutineMealDto.trainer_id,
      )
      if (!trainerResponse || !trainerResponse?.data) {
        return this.responseService.error(
          ROUTINE_MEAL_MESSAGES.TRAINER_NOT_FOUND,
        )
      }

      // Validar comidas
      const mealIds = new Set(
        createRoutineMealDto.days.flatMap((day) =>
          day.meals.map((meal) => meal.meal_id),
        ),
      )

      const meals = await Promise.all(
        Array.from(mealIds).map((id) => this.mealRepository.findOneBy({ id })),
      )

      if (meals.some((meal) => !meal)) {
        return this.responseService.error(ROUTINE_MEAL_MESSAGES.MEAL_NOT_FOUND)
      }

      // Validar orden único por día
      for (const day of createRoutineMealDto.days) {
        const orders = day.meals.map((meal) => meal.order)
        if (new Set(orders).size !== orders.length) {
          return this.responseService.error(
            `${ROUTINE_MEAL_MESSAGES.DUPLICATE_ORDER} (Día ${day.day_of_week})`,
          )
        }
      }

      // Crear rutina
      const routine = this.routineRepository.create({
        ...createRoutineMealDto,
        type: RoutineTypes.MEAL,
        status: RoutineStatus.ACTIVE,
        created_by: trainerResponse.data,
        student: studentResponse.data,
        trainer: trainerResponse.data,
      })

      const savedRoutine = await this.routineRepository.save(routine)

      // Crear días y comidas
      for (const dayDto of createRoutineMealDto.days) {
        const routineDay = this.routineDayRepository.create({
          day_of_week: dayDto.day_of_week,
          date: dayDto.date,
          routine: savedRoutine,
        })

        const savedDay = await this.routineDayRepository.save(routineDay)

        const routineMeals = dayDto.meals.map((mealDto) => {
          const meal = meals.find((m) => m.id === mealDto.meal_id)
          return this.routineMealRepository.create({
            ...mealDto,
            day: savedDay,
            meal: meal,
          })
        })

        await this.routineMealRepository.save(routineMeals)
      }

      return this.responseService.success(
        await this.findOne(savedRoutine.id),
        ROUTINE_MEAL_MESSAGES.CREATED,
      )
    } catch (error) {
      console.error('Error in create:', error)
      return this.responseService.error(ROUTINE_MEAL_MESSAGES.CREATE_ERROR)
    }
  }

  async createFromPreset(
    presetId: number,
    startDate: Date,
    studentId: number,
    trainerId: number,
  ) {
    // Obtener preset
    const presetResponse = await this.presetMealsService.findOne(presetId)
    if (!presetResponse || !presetResponse?.data) {
      return this.responseService.error(ROUTINE_MEAL_MESSAGES.PRESET_NOT_FOUND)
    }

    // obtener estudiante con el entrenador y el user del entrenador que está anidado
    const studentResponse = await this.studentsService.findOne(studentId)

    console.log(studentResponse)
    if (!studentResponse || !studentResponse?.data) {
      return this.responseService.error(ROUTINE_MEAL_MESSAGES.STUDENT_NOT_FOUND)
    }

    // Validar entrenador
    const trainerResponse = await this.usersService.findOne(trainerId)
    if (!trainerResponse || !trainerResponse?.data) {
      return this.responseService.error(ROUTINE_MEAL_MESSAGES.TRAINER_NOT_FOUND)
    }

    const preset = presetResponse.data
    const student = studentResponse.data
    const trainer = trainerResponse.data

    console.log(student.trainer)

    // Validar fechas
    const start = new Date(startDate)
    const end = new Date(startDate)
    end.setDate(end.getDate() + preset.days.length)

    // Crear rutina
    const routine = this.routineRepository.create({
      name: preset.name,
      description: preset.description,
      start_date: start,
      end_date: end,
      type: RoutineTypes.MEAL,
      student: student,
      trainer: trainer,
      created_by: trainer,
      status: RoutineStatus.ACTIVE,
    })

    const savedRoutine = await this.routineRepository.save(routine)

    for (const presetDay of preset.days) {
      const routineDay = this.routineDayRepository.create({
        day_of_week: presetDay.day_of_week,
        date: new Date(start),
        routine: savedRoutine,
      })

      const savedDay = await this.routineDayRepository.save(routineDay)

      const routineMeals = presetDay.meals.map((presetMeal) => {
        return this.routineMealRepository.create({
          day: savedDay,
          meal: presetMeal.meal,
          order: presetMeal.order,
          consumed: false,
        })
      })

      await this.routineMealRepository.save(routineMeals)
    }

    return this.responseService.success(
      await this.findOne(savedRoutine.id),
      ROUTINE_MEAL_MESSAGES.CREATED,
    )
  }

  async findAll() {
    const routines = await this.routineRepository.find({
      where: { type: RoutineTypes.MEAL },
      relations: {
        student: {
          user: true,
        },
        trainer: {
          user: true,
        },
        days: {
          meals: {
            meal: true,
          },
        },
      },
      order: {
        created_at: 'DESC',
        days: {
          day_of_week: 'ASC',
          meals: {
            order: 'ASC',
          },
        },
      },
    })

    if (!routines.length) {
      return this.responseService.error(ROUTINE_MEAL_MESSAGES.MANY_NOT_FOUND)
    }

    return this.responseService.success(
      routines,
      ROUTINE_MEAL_MESSAGES.FOUND_MANY,
    )
  }

  async findAllByStudent(studentId: number) {
    const routines = await this.routineRepository.find({
      where: {
        type: RoutineTypes.MEAL,
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
          meals: {
            meal: true,
          },
        },
      },
      order: {
        start_date: 'DESC',
        days: {
          day_of_week: 'ASC',
          meals: {
            order: 'ASC',
          },
        },
      },
    })

    if (!routines.length) {
      return this.responseService.error(ROUTINE_MEAL_MESSAGES.MANY_NOT_FOUND)
    }

    return this.responseService.success(
      routines,
      ROUTINE_MEAL_MESSAGES.FOUND_MANY,
    )
  }

  async findActiveByStudent(studentId: number) {
    const now = new Date()
    const routines = await this.routineRepository.find({
      where: {
        type: RoutineTypes.MEAL,
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
          meals: {
            meal: true,
          },
        },
      },
      order: {
        start_date: 'DESC',
      },
    })

    if (!routines.length) {
      return this.responseService.error(
        ROUTINE_MEAL_MESSAGES.NO_ACTIVE_ROUTINES,
      )
    }

    return this.responseService.success(
      routines,
      ROUTINE_MEAL_MESSAGES.FOUND_ACTIVE,
    )
  }

  async findOne(id: number) {
    const routine = await this.routineRepository.findOne({
      where: {
        id,
        type: RoutineTypes.MEAL,
      },
      relations: {
        student: {
          user: true,
        },
        trainer: {
          user: true,
        },
        days: {
          meals: {
            meal: true,
          },
        },
      },
      order: {
        days: {
          day_of_week: 'ASC',
          meals: {
            order: 'ASC',
          },
        },
      },
    })

    if (!routine) {
      return this.responseService.error(ROUTINE_MEAL_MESSAGES.NOT_FOUND)
    }

    return this.responseService.success(routine, ROUTINE_MEAL_MESSAGES.FOUND)
  }

  async update(id: number, updateRoutineMealDto: UpdateRoutineMealDto) {
    const routineResponse = await this.findOne(id)
    if (!routineResponse || !routineResponse?.data) return

    const routine = routineResponse.data

    if (
      routine.status === RoutineStatus.COMPLETED ||
      routine.status === RoutineStatus.CANCELLED
    ) {
      return this.responseService.error(
        ROUTINE_MEAL_MESSAGES.CANNOT_UPDATE_FINISHED,
      )
    }

    // Actualizar datos básicos si se proporcionan
    if (updateRoutineMealDto.name || updateRoutineMealDto.description) {
      await this.routineRepository.update(id, {
        name: updateRoutineMealDto.name,
        description: updateRoutineMealDto.description,
      })
    }

    // Actualizar días y comidas si se proporcionan
    if (updateRoutineMealDto.days) {
      // Validar comidas
      const mealIds = new Set(
        updateRoutineMealDto.days.flatMap((day) =>
          day.meals.map((meal) => meal.meal_id),
        ),
      )

      const meals = await Promise.all(
        Array.from(mealIds).map((id) => this.mealRepository.findOneBy({ id })),
      )

      if (meals.some((meal) => !meal)) {
        return this.responseService.error(ROUTINE_MEAL_MESSAGES.MEAL_NOT_FOUND)
      }

      // Validar orden único por día
      for (const day of updateRoutineMealDto.days) {
        const orders = day.meals.map((meal) => meal.order)
        if (new Set(orders).size !== orders.length) {
          return this.responseService.error(
            `${ROUTINE_MEAL_MESSAGES.DUPLICATE_ORDER} (Día ${day.day_of_week})`,
          )
        }
      }

      // Eliminar días y comidas existentes
      await this.routineMealRepository
        .createQueryBuilder()
        .delete()
        .from(RoutineMeal)
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

      // Crear nuevos días y comidas
      for (const dayDto of updateRoutineMealDto.days) {
        const routineDay = this.routineDayRepository.create({
          ...dayDto,
          routine: routine,
        })

        const savedDay = await this.routineDayRepository.save(routineDay)

        const routineMeals = dayDto.meals.map((mealDto) => {
          const meal = meals.find((m) => m.id === mealDto.meal_id)
          return this.routineMealRepository.create({
            ...mealDto,
            day: savedDay,
            meal: meal,
            consumed: false,
          })
        })

        await this.routineMealRepository.save(routineMeals)
      }
    }

    return this.responseService.success(
      await this.findOne(id),
      ROUTINE_MEAL_MESSAGES.UPDATED,
    )
  }

  async markMealConsumed(routineId: number, mealId: number) {
    const routineResponse = await this.findOne(routineId)
    if (!routineResponse || !routineResponse?.data) return

    const routine = routineResponse.data

    if (routine.status !== RoutineStatus.ACTIVE) {
      return this.responseService.error(
        ROUTINE_MEAL_MESSAGES.ROUTINE_NOT_ACTIVE,
      )
    }

    const meal = await this.routineMealRepository.findOne({
      where: {
        id: mealId,
        day: {
          routine: { id: routineId },
        },
      },
    })

    if (!meal) {
      return this.responseService.error(ROUTINE_MEAL_MESSAGES.MEAL_NOT_FOUND)
    }

    meal.consumed = true
    await this.routineMealRepository.save(meal)

    return this.responseService.success(
      meal,
      ROUTINE_MEAL_MESSAGES.MEAL_CONSUMED,
    )
  }

  async markMealUnconsumed(routineId: number, mealId: number) {
    const routineResponse = await this.findOne(routineId)
    if (!routineResponse || !routineResponse?.data) return

    const routine = routineResponse.data

    if (routine.status !== RoutineStatus.ACTIVE) {
      return this.responseService.error(
        ROUTINE_MEAL_MESSAGES.ROUTINE_NOT_ACTIVE,
      )
    }

    const meal = await this.routineMealRepository.findOne({
      where: {
        id: mealId,
        day: {
          routine: { id: routineId },
        },
      },
    })

    if (!meal) {
      return this.responseService.error(ROUTINE_MEAL_MESSAGES.MEAL_NOT_FOUND)
    }

    meal.consumed = false
    await this.routineMealRepository.save(meal)

    return this.responseService.success(
      meal,
      ROUTINE_MEAL_MESSAGES.MEAL_UNCONSUMED,
    )
  }

  async changeStatus(id: number, status: RoutineStatus) {
    try {
      const routineResponse = await this.findOne(id)
      if (!routineResponse || !routineResponse?.data) return

      const routine = routineResponse.data

      // Validar transiciones de estado
      if (
        routine.status === RoutineStatus.COMPLETED ||
        routine.status === RoutineStatus.CANCELLED
      ) {
        return this.responseService.error(
          ROUTINE_MEAL_MESSAGES.CANNOT_CHANGE_STATUS,
        )
      }

      // Si se está completando, verificar que todas las comidas estén consumidas
      if (status === RoutineStatus.COMPLETED) {
        const hasUnconsumedMeals = routine.days.some((day) =>
          day.meals.some((meal) => !meal.consumed),
        )

        if (hasUnconsumedMeals) {
          return this.responseService.error(
            ROUTINE_MEAL_MESSAGES.UNCONSUMED_MEALS,
          )
        }
      }

      routine.status = status
      await this.routineRepository.save(routine)

      return this.responseService.success(
        await this.findOne(id),
        ROUTINE_MEAL_MESSAGES.STATUS_UPDATED,
      )
    } catch (error) {
      console.error('Error in changeStatus:', error)
      return this.responseService.error(ROUTINE_MEAL_MESSAGES.UPDATE_ERROR)
    }
  }

  async remove(id: number) {
    const routineResponse = await this.findOne(id)
    if (!routineResponse || !routineResponse?.data) return

    const routine = routineResponse.data

    // Eliminar comidas
    await this.routineMealRepository
      .createQueryBuilder()
      .delete()
      .from(RoutineMeal)
      .where('day_id IN (SELECT id FROM routine_day WHERE routine_id = :id)', {
        id,
      })
      .execute()

    // Eliminar días
    await this.routineDayRepository
      .createQueryBuilder()
      .delete()
      .from(RoutineDay)
      .where('routine_id = :id', { id })
      .execute()

    // Eliminar rutina
    await this.routineRepository.delete(id)

    return this.responseService.success(routine, ROUTINE_MEAL_MESSAGES.DELETED)
  }
}
