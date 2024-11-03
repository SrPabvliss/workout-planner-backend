import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ResponseService } from 'src/shared/response-format/response.service'
import { UsersService } from 'src/users/users.service'
import { Preset } from '../entities/preset.entity'
import { PresetDay } from '../entities/preset-day.entity'
import { PresetMeal } from '../entities/preset-meal.entity'
import { Meal } from 'src/meals/entities/meal.entity'
import { CreatePresetMealDto } from '../dto/meals/create-preset-meal.dto'
import { PRESET_MEAL_MESSAGES } from '../messages/preset-meal-messages'
import { UpdatePresetMealDto } from '../dto/meals/update-preset-meal.dto'

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

      // 2. Crear el preset
      const preset = this.presetRepository.create({
        name: createPresetMealDto.name,
        description: createPresetMealDto.description,
        created_by: userResponse.data,
      })

      const savedPreset = await this.presetRepository.save(preset)

      // 3. Procesar cada día
      for (const dayDto of createPresetMealDto.days) {
        // Verificar que todas las comidas existan antes de crear el día
        const meals = await Promise.all(
          dayDto.meals.map((mealDto) =>
            this.mealRepository.findOneBy({ id: mealDto.meal_id }),
          ),
        )

        if (meals.some((meal) => !meal)) {
          await this.presetRepository.delete(savedPreset.id)
          return this.responseService.error(PRESET_MEAL_MESSAGES.MEAL_NOT_FOUND)
        }

        // Crear el día
        const presetDay = this.presetDayRepository.create({
          day_of_week: dayDto.day_of_week,
          preset: savedPreset,
        })
        const savedDay = await this.presetDayRepository.save(presetDay)

        // Crear las comidas del día
        await Promise.all(
          dayDto.meals.map(async (mealDto, index) => {
            const presetMeal = this.presetMealRepository.create({
              day: savedDay,
              meal: meals[index],
            })
            return this.presetMealRepository.save(presetMeal)
          }),
        )
      }

      const createdPresetResponse = await this.findOne(savedPreset.id)
      if (!createdPresetResponse || !createdPresetResponse.data) {
        return this.responseService.error(PRESET_MEAL_MESSAGES.CREATE_ERROR)
      }

      return this.responseService.success(
        createdPresetResponse.data,
        PRESET_MEAL_MESSAGES.CREATED,
      )
    } catch (error) {
      return this.responseService.error(PRESET_MEAL_MESSAGES.CREATE_ERROR)
    }
  }

  async findAll() {
    try {
      const presets = await this.presetRepository
        .createQueryBuilder('preset')
        .leftJoinAndSelect('preset.created_by', 'user')
        .leftJoinAndSelect('preset.days', 'days')
        .leftJoinAndSelect('days.meals', 'presetMeals')
        .leftJoinAndSelect('presetMeals.meal', 'meal')
        .orderBy('preset.created_at', 'DESC')
        .addOrderBy('days.day_of_week', 'ASC')
        .getMany()

      if (!presets.length) {
        return this.responseService.error(PRESET_MEAL_MESSAGES.MANY_NOT_FOUND)
      }

      return this.responseService.success(
        presets,
        PRESET_MEAL_MESSAGES.FOUND_MANY,
      )
    } catch (error) {
      return this.responseService.error(PRESET_MEAL_MESSAGES.FIND_ERROR)
    }
  }

  async findOne(id: number) {
    try {
      const preset = await this.presetRepository
        .createQueryBuilder('preset')
        .leftJoinAndSelect('preset.created_by', 'user')
        .leftJoinAndSelect('preset.days', 'days')
        .leftJoinAndSelect('days.meals', 'presetMeals')
        .leftJoinAndSelect('presetMeals.meal', 'meal')
        .where('preset.id = :id', { id })
        .orderBy('days.day_of_week', 'ASC')
        .getOne()

      if (!preset) {
        return this.responseService.error(PRESET_MEAL_MESSAGES.NOT_FOUND)
      }

      return this.responseService.success(preset, PRESET_MEAL_MESSAGES.FOUND)
    } catch (error) {
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
        // Verificar comidas nuevas
        for (const dayDto of updatePresetMealDto.days) {
          if (dayDto.meals) {
            const meals = await Promise.all(
              dayDto.meals.map((mealDto) =>
                this.mealRepository.findOneBy({ id: mealDto.meal_id }),
              ),
            )

            if (meals.some((meal) => !meal)) {
              return this.responseService.error(
                PRESET_MEAL_MESSAGES.MEAL_NOT_FOUND,
              )
            }
          }
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

          if (dayDto.meals) {
            const meals = await Promise.all(
              dayDto.meals.map((mealDto) =>
                this.mealRepository.findOneBy({ id: mealDto.meal_id }),
              ),
            )

            await Promise.all(
              dayDto.meals.map(async (mealDto, index) => {
                const presetMeal = this.presetMealRepository.create({
                  day: savedDay,
                  meal: meals[index],
                })
                return this.presetMealRepository.save(presetMeal)
              }),
            )
          }
        }
      }

      const updatedPresetResponse = await this.findOne(id)
      if (!updatedPresetResponse || !updatedPresetResponse.data) {
        return this.responseService.error(PRESET_MEAL_MESSAGES.UPDATE_ERROR)
      }

      return this.responseService.success(
        updatedPresetResponse.data,
        PRESET_MEAL_MESSAGES.UPDATED,
      )
    } catch (error) {
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
      return this.responseService.error(PRESET_MEAL_MESSAGES.DELETE_ERROR)
    }
  }
}
