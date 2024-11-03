import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ResponseService } from 'src/shared/response-format/response.service'
import { UsersService } from 'src/users/users.service'
import { Preset } from '../entities/preset.entity'
import { PresetDay } from '../entities/preset-day.entity'
import { PresetMeal } from '../entities/preset-meal.entity'
import { Meal } from 'src/meals/entities/meal.entity'
import { PRESET_MEAL_MESSAGES } from '../messages/preset-meal-messages'
import { CreatePresetMealDto } from '../dto/meals/create-preset-meal.dto'
import { UpdatePresetMealDto } from '../dto/meals/update-preset-meal.dto'
import { PresetType } from '../enums/preset-type.enum'

@Injectable()
export class PresetMealsService {
  constructor(
    @InjectRepository(Preset)
    private readonly presetRepository: Repository<Preset>,
    @InjectRepository(PresetDay)
    private readonly presetDayRepository: Repository<PresetDay>,
    @InjectRepository(PresetMeal)
    private readonly presetMealRepository: Repository<PresetMeal>,
    @InjectRepository(Meal)
    private readonly mealRepository: Repository<Meal>,
    private readonly usersService: UsersService,
    private readonly responseService: ResponseService,
  ) {}

  async create(createPresetMealDto: CreatePresetMealDto, userId: number) {
    try {
      // 1. Obtener usuario
      const userResponse = await this.usersService.findOne(userId)
      if (!userResponse || !userResponse.data) {
        return this.responseService.error(PRESET_MEAL_MESSAGES.USER_NOT_FOUND)
      }

      // 2. Verificar existencia de todas las comidas primero
      const mealIds = new Set(
        createPresetMealDto.days.flatMap((day) =>
          day.meals.map((meal) => meal.meal_id),
        ),
      )

      const meals = await Promise.all(
        Array.from(mealIds).map((id) => this.mealRepository.findOneBy({ id })),
      )

      if (meals.some((meal) => !meal)) {
        const foundIds = new Set(meals.filter((m) => m).map((m) => m.id))
        const missingIds = Array.from(mealIds).filter((id) => !foundIds.has(id))

        console.error('Missing meal IDs:', missingIds)
        return this.responseService.error(
          `${PRESET_MEAL_MESSAGES.MEAL_NOT_FOUND}: ${missingIds.join(', ')}`,
        )
      }

      // 3. Crear el preset
      const preset = this.presetRepository.create({
        name: createPresetMealDto.name,
        description: createPresetMealDto.description,
        created_by: userResponse.data,
        type: PresetType.MEAL,
      })

      const savedPreset = await this.presetRepository.save(preset)

      // 4. Crear días y comidas
      for (const dayDto of createPresetMealDto.days) {
        const presetDay = this.presetDayRepository.create({
          day_of_week: dayDto.day_of_week,
          preset: savedPreset,
        })
        const savedDay = await this.presetDayRepository.save(presetDay)

        // 5. Crear las comidas del día
        await Promise.all(
          dayDto.meals.map(async (mealDto) => {
            const meal = meals.find((m) => m.id === mealDto.meal_id)
            const presetMeal = this.presetMealRepository.create({
              day: savedDay,
              meal: meal,
              order: mealDto.order,
            })
            return this.presetMealRepository.save(presetMeal)
          }),
        )
      }

      const result = await this.findOne(savedPreset.id)
      if (!result || !result.data) {
        await this.presetRepository.delete(savedPreset.id)
        return this.responseService.error(PRESET_MEAL_MESSAGES.CREATE_ERROR)
      }

      return this.responseService.success(
        result.data,
        PRESET_MEAL_MESSAGES.CREATED,
      )
    } catch (error) {
      console.error('Error in create:', error)
      return this.responseService.error(PRESET_MEAL_MESSAGES.CREATE_ERROR)
    }
  }

  async findAll() {
    try {
      const presets = await this.presetRepository.find({
        relations: {
          created_by: true,
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
        where: {
          type: PresetType.MEAL,
        },
      })

      if (!presets.length) {
        return this.responseService.error(PRESET_MEAL_MESSAGES.MANY_NOT_FOUND)
      }

      return this.responseService.success(
        presets,
        PRESET_MEAL_MESSAGES.FOUND_MANY,
      )
    } catch (error) {
      console.error('Error in findAll:', error)
      return this.responseService.error(PRESET_MEAL_MESSAGES.FIND_ERROR)
    }
  }

  async findOne(id: number) {
    try {
      const preset = await this.presetRepository.findOne({
        where: { id },
        relations: {
          created_by: true,
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

      if (!preset) {
        return this.responseService.error(PRESET_MEAL_MESSAGES.NOT_FOUND)
      }

      return this.responseService.success(preset, PRESET_MEAL_MESSAGES.FOUND)
    } catch (error) {
      console.error('Error in findOne:', error)
      return this.responseService.error(PRESET_MEAL_MESSAGES.FIND_ERROR)
    }
  }

  async update(id: number, updatePresetMealDto: UpdatePresetMealDto) {
    try {
      const presetResponse = await this.findOne(id)
      if (!presetResponse || !presetResponse.data) return

      // 1. Actualizar datos básicos del preset
      if (updatePresetMealDto.name || updatePresetMealDto.description) {
        await this.presetRepository.update(id, {
          name: updatePresetMealDto.name,
          description: updatePresetMealDto.description,
        })
      }

      // 2. Si hay días para actualizar
      if (updatePresetMealDto.days) {
        // Verificar existencia de todas las comidas primero
        const mealIds = new Set(
          updatePresetMealDto.days.flatMap((day) =>
            day.meals.map((meal) => meal.meal_id),
          ),
        )

        const meals = await Promise.all(
          Array.from(mealIds).map((id) =>
            this.mealRepository.findOneBy({ id }),
          ),
        )

        if (meals.some((meal) => !meal)) {
          const foundIds = new Set(meals.filter((m) => m).map((m) => m.id))
          const missingIds = Array.from(mealIds).filter(
            (id) => !foundIds.has(id),
          )

          return this.responseService.error(
            `${PRESET_MEAL_MESSAGES.MEAL_NOT_FOUND}: ${missingIds.join(', ')}`,
          )
        }

        // Eliminar comidas y días actuales
        await this.presetMealRepository
          .createQueryBuilder()
          .delete()
          .from(PresetMeal)
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

        // Crear nuevos días y comidas
        for (const dayDto of updatePresetMealDto.days) {
          const presetDay = this.presetDayRepository.create({
            day_of_week: dayDto.day_of_week,
            preset: presetResponse.data,
          })
          const savedDay = await this.presetDayRepository.save(presetDay)

          await Promise.all(
            dayDto.meals.map(async (mealDto) => {
              const meal = meals.find((m) => m.id === mealDto.meal_id)
              const presetMeal = this.presetMealRepository.create({
                day: savedDay,
                meal: meal,
                order: mealDto.order,
              })
              return this.presetMealRepository.save(presetMeal)
            }),
          )
        }
      }

      const result = await this.findOne(id)
      if (!result || !result.data) {
        return this.responseService.error(PRESET_MEAL_MESSAGES.UPDATE_ERROR)
      }

      return this.responseService.success(
        result.data,
        PRESET_MEAL_MESSAGES.UPDATED,
      )
    } catch (error) {
      console.error('Error in update:', error)
      return this.responseService.error(PRESET_MEAL_MESSAGES.UPDATE_ERROR)
    }
  }

  async remove(id: number) {
    try {
      const presetResponse = await this.findOne(id)
      if (!presetResponse || !presetResponse.data) return

      // Usar query builder para eliminar en cascada
      await this.presetMealRepository
        .createQueryBuilder()
        .delete()
        .from(PresetMeal)
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
        PRESET_MEAL_MESSAGES.DELETED,
      )
    } catch (error) {
      console.error('Error in remove:', error)
      return this.responseService.error(PRESET_MEAL_MESSAGES.DELETE_ERROR)
    }
  }
}
